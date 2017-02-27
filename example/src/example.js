const diplomacy = require('js-diplomacy')
const vizdip = require('./../../src/vizdip')

const Season = diplomacy.standardBoard.Season
const Result = diplomacy.standardRule.Result
const OrderType = diplomacy.standardRule.Order.OrderType
const Phase = diplomacy.standardRule.Phase
const Power = diplomacy.standardMap.Power
const Helper = diplomacy.standardRule.Helper
const Utils = diplomacy.standardRule.Utils

const variant = diplomacy.standard.variant

let viz = null
let board = variant.initialBoard
let $$ = new Helper(board)

function stringify (order) {
  function s (militaryBranch) {
    if (militaryBranch === diplomacy.standardRule.MilitaryBranch.Army) {
      return 'A'
    } else {
      return 'F'
    }
  }

  switch (order.tpe) {
    case OrderType.Hold:
      return `${s(order.unit.militaryBranch)} ${order.unit.location} H`
    case OrderType.Retreat:
    case OrderType.Move:
      return `${s(order.unit.militaryBranch)} ${order.unit.location} &#x2192 ${order.destination}`
    case OrderType.Support:
      return `${s(order.unit.militaryBranch)} ${order.unit.location} S ${stringify(order.target)}`
    case OrderType.Convoy:
      return `${s(order.unit.militaryBranch)} ${order.unit.location} C ${stringify(order.target)}`
    case OrderType.Disband:
      return `Disband ${s(order.unit.militaryBranch)} ${order.unit.location}`
    case OrderType.Build:
      return `Build ${s(order.unit.militaryBranch)} ${order.unit.location}`
  }
}

function getOrders () {
  const retval = []
  Array.from(document.getElementsByClassName('order')).forEach(orderElem => {
    try {
      const tgt = orderElem.children[0].options[orderElem.children[0].selectedIndex].innerHTML
      const tpe = orderElem.children[1].options[orderElem.children[1].selectedIndex].value
      const dest = orderElem.children[2].options[orderElem.children[2].selectedIndex]

      const loc = [...board.map.locations].find(u => u.toString() === tgt)

      if (!loc) return

      switch (tpe) {
        case 'M':
          (() => {
            const d1 = [...board.map.locations].find(l => l.toString() === dest.innerHTML)
            if (!d1) return
            retval.push($$.U(loc).move(d1))
          })()
          break
        case 'S':
          (() => {
            if (!dest) {
              return
            }

            const target = JSON.parse(dest.value)
            const targetLoc = [...board.map.locations].find(u => u.toString() === target[0])
            if (target.length === 1) {
              // Hold
              retval.push($$.U(loc).support($$.U(targetLoc).hold()))
            } else if (target.length === 2) {
              // Move
              const d1 = [...board.map.locations].find(l => l.toString() === target[1])
              if (d1) {
                retval.push($$.U(loc).support($$.U(targetLoc).move(d1)))
              }
            }
          })()
          break
        case 'C':
          (() => {
            if (!dest) {
              return
            }
            const target = JSON.parse(dest.value)
            const targetLoc = [...board.map.locations].find(u => u.toString() === target[0])
            if (target.length === 2) {
              // Move
              const d1 = [...board.map.locations].find(l => l.toString() === target[1])
              if (d1) {
                retval.push($$.U(loc).convoy($$.U(targetLoc).move(d1)))
              }
            }
          })()
          break
        case 'R':
          (() => {
            const d2 = [...board.map.locations].find(l => l.toString() === dest.innerHTML)
            if (d2) {
              retval.push($$.U(loc).retreat(d2))
            }
          })()
          break
        case 'B':
          (() => {
            if (dest.innerHTML === 'Fleet') {
              retval.push($$.F(loc).build())
            } else if (dest.innerHTML === 'Army') {
              retval.push($$.A(loc).build())
            }
          })()
          break
        case 'H':
          (() => {
            retval.push($$.U(loc).hold())
          })()
          break
        case 'D':
          (() => {
            retval.push($$.U(loc).disband())
          })()
          break
      }
    } catch (e) {
      console.log(e)
    }
  })
  return retval
}

function visualizeOrders () {
  viz.visualizeOrders(getOrders())
}

function updateDestLists (orderElem) {
  const targetElem = orderElem.getElementsByClassName('order-target')[0]
  const tpeElem = orderElem.getElementsByClassName('order-type')[0]
  const destElem = orderElem.getElementsByClassName('order-dest')[0]

  const target = targetElem.options[targetElem.selectedIndex].text
  const tpe = tpeElem.options[tpeElem.selectedIndex].value

  const loc = [...board.map.locations].find(x => x.toString() === target)

  if (!loc) {
    return
  }

  if (tpe !== '') {
    while (destElem.firstChild) destElem.removeChild(destElem.firstChild)
  }

  destElem.style.display = 'inline'
  switch (tpe) {
    case 'M':
      Utils.movableLocationsOf(board, $$.U(loc).unit).forEach(location => {
        const el = document.createElement('option')
        el.innerHTML = location.toString()
        destElem.appendChild(el)
      })
      break
    case 'S':
      getOrders().forEach(order => {
        // TODO
        const el = document.createElement('option')
        if (order.tpe === OrderType.Move) {
          el.innerHTML = stringify(order)
          el.value = JSON.stringify([order.unit.location.toString(), order.destination.toString()])
        } else {
          el.innerHTML = `${order.unit} H`
          el.value = JSON.stringify([order.unit.location.toString()])
        }
        destElem.appendChild(el)
      })
      break
    case 'C':
      getOrders().forEach(order => {
        if (order.tpe === OrderType.Move) {
          const el = document.createElement('option')
          el.innerHTML = stringify(order)
          el.value = JSON.stringify([order.unit.location.toString(), order.destination.toString()])
          destElem.appendChild(el)
        }
      })
      break
    case 'R':
      // TODO consider `attackedFrom`
      Utils.locationsToRetreat(board, $$.U(loc).unit, null).forEach(location => {
        const el = document.createElement('option')
        el.innerHTML = location.toString()
        destElem.appendChild(el)
      })
      break
    case 'B':
      destElem.innerHTML += '<option></option>'
      loc.militaryBranches.forEach(x => {
        destElem.innerHTML += `<option>${x.name}</option>`
      })
      break
    default:
      destElem.style.display = 'none'
      break
  }
}

function createOrderItem () {
  const elem = document.createElement('li')
  elem.classList.add('list-group-item')
  elem.classList.add('order')
  return elem
}
function createTargetUnitList (elem) {
  const target = document.createElement('select')
  target.classList.add('order-target')
  target.classList.add('select-picker')
  if (elem.length === 1) {
    target.setAttribute('disabled', 'true')
    target.innerHTML = `<option>${elem[0]}</option>`
  } else {
    target.innerHTML = '<option></option>'
    elem.forEach(el => {
      target.innerHTML += `<option>${el}</option>`
    })
  }
  target.addEventListener('change', (e) => {
    updateDestLists(e.target.parentNode)
    visualizeOrders()
  })
  return target
}
function createOrderTypeList (types) {
  const target = document.createElement('select')
  target.classList.add('order-type')
  target.classList.add('select-picker')
  if (types.length === 1) {
    target.setAttribute('disabled', 'true')
    target.innerHTML = `<option value="${types[0][0]}">${types[0][1]}</option>`
  } else {
    target.innerHTML = '<option></option>'
    types.forEach(el => {
      target.innerHTML += `<option value="${el[0]}">${el[1]}</option>`
    })
  }
  target.addEventListener('change', (e) => {
    updateDestLists(e.target.parentNode)
    visualizeOrders()
  })
  return target
}
function createDestList () {
  const target = document.createElement('select')
  target.classList.add('order-dest')
  target.classList.add('select-picker')
  target.addEventListener('change', () => visualizeOrders())
  return target
}

function createOrderList () {
  // Clear list
  board.map.powers.forEach(power => {
    const powerPanel = document.getElementById(`order-${power}`)
    while (powerPanel.firstChild) powerPanel.removeChild(powerPanel.firstChild)
  })

  // Create list
  board.map.powers.forEach(power => {
    const powerPanel = document.getElementById(`order-${power}`)
    switch (board.state.phase) {
      case Phase.Movement:
        (() => {
          const us = [...board.units].filter(x => x.power === power)
          us.forEach(unit => {
            const elem = createOrderItem()
            const target = createTargetUnitList([unit.location])
            const tpe =
              createOrderTypeList([['M', '&#x2192'], ['S', 'S'], ['C', 'C'], ['H', 'H']])
            const dest = createDestList()
            elem.appendChild(target)
            elem.appendChild(tpe)
            elem.appendChild(dest)
            powerPanel.appendChild(elem)
          })
        })()
        break
      case Phase.Retreat:
        (() => {
          const us = [...board.units].filter(x => x.power === power)
          us.forEach(unit => {
            if (!board.unitStatuses.get(unit)) return
            const elem = createOrderItem()
            const target = createTargetUnitList([unit.location])
            const tpe =
              createOrderTypeList([['R', '&#x2192'], ['D', 'Disband']])
            const dest = createDestList()
            elem.appendChild(target)
            elem.appendChild(tpe)
            elem.appendChild(dest)
            powerPanel.appendChild(elem)
          })
        })()
        break
      case Phase.Build:
        (() => {
          const num = Utils.numberOfBuildableUnits(board).get(power) || 0
          if (num > 0) {
            // Build
            const candidates =
              [...board.map.locations].filter(l => {
                return l.province.isSupplyCenter && l.province.homeOf === power
              })
            for (let i = 0; i < num; i++) {
              const elem = createOrderItem()
              const target = createTargetUnitList(candidates)
              const tpe =
                createOrderTypeList([['B', 'Build']])
              const dest = createDestList()
              elem.appendChild(target)
              elem.appendChild(tpe)
              elem.appendChild(dest)
              powerPanel.appendChild(elem)
            }
          } else if (num < 0) {
            // Disband
            const us = [...board.units].filter(x => x.power === power)
            for (let i = 0; i < -num; i++) {
              const elem = createOrderItem()
              const target = createTargetUnitList(us.map(u => u.location))
              const tpe =
                createOrderTypeList([['D', 'Disband']])
              const dest = createDestList()
              dest.style.display = 'none'
              elem.appendChild(target)
              elem.appendChild(tpe)
              elem.appendChild(dest)
              powerPanel.appendChild(elem)
            }
          }
        })()
        break
    }
  })
}

function createOrderPanel () {
  const ordersElem = document.getElementById('orders')
  board.map.powers.forEach(power => {
    const panel = document.createElement('div')
    panel.classList.add('panel')
    panel.classList.add('panel-default')
    const header = document.createElement('div')
    header.classList.add('panel-heading')
    header.innerHTML = Power[power]
    const body = document.createElement('div')
    body.classList.add('pael-body')
    body.innerHTML = `<ul class="list-group" id="order-${power}"></ul>`

    panel.appendChild(header)
    panel.appendChild(body)
    ordersElem.appendChild(panel)
  })
}

function resolve () {
  // Resolve orders
  const r = variant.rule.resolve(board, getOrders())

  const resultBody = document.getElementById('result-body')
  while (resultBody.firstChild) resultBody.removeChild(resultBody.firstChild)

  // Show error message
  if (r.err) {
    const errorElem = document.getElementById('result-error')
    errorElem.innerHTML = r.err.toString()
    $('#error-dialog').modal('show')
    return
  }

  const result = r.result

  // Show results
  result.results.forEach(result => {
    const tr = document.createElement('tr')
    const u = document.createElement('td')
    u.setAttribute('scope', 'row')
    u.innerHTML = stringify(result.target)
    const r = document.createElement('td')
    if (result.result === Result.Success) {
      r.innerHTML += `<span class="label label-success">${Result[result.result]}</span>`
    } else if (result.result === Result.Dislodged) {
      r.innerHTML += `<span class="label label-danger">${Result[result.result]}</span>`
    } else {
      r.innerHTML += `<span class="label label-warning">${Result[result.result]}</span>`
    }

    if (result.replacedBy) {
      r.innerHTML += ` (replaced by ${result.replacedBy}: ${result.invalidReason})`
    }
    tr.appendChild(u)
    tr.appendChild(r)
    resultBody.appendChild(tr)
  })

  // Visualize the next board
  if (result.isFinished) {
    alert('Game is finished')
    return
  }

  board = result.board
  $$ = new Helper(board)

  // Update the UI
  viz.visualizeBoard(result.board)
  createOrderList()
  visualizeOrders()
}

function adjustMap () {
  const mapElem = document.getElementById('map')
  const rect = document.getElementById('map-col').getBoundingClientRect()
  const width = rect.right - rect.left - 30
  mapElem.width = width
}

function initialize () {
  const mapElem = document.getElementById('map')

  // Get svg images
  const map = mapElem.contentDocument
  const tmp = map.createElementNS('http://www.w3.org/2000/svg', 'g')
  const armyHTML = document.getElementById('army').contentDocument.getElementsByTagName('g')[0].outerHTML
  tmp.innerHTML = armyHTML
  const army = tmp.children[0].cloneNode(true)
  const fleetHTML = document.getElementById('fleet').contentDocument.getElementsByTagName('g')[0].outerHTML
  tmp.innerHTML = fleetHTML
  const fleet = tmp.children[0].cloneNode(true)
  tmp.remove()

  // Create visualizer instance
  const svgs = {
    map: map,
    army: army,
    fleet: fleet
  }
  const colors = {
    power: (power) => {
      switch (power) {
        case Power.England:
          return 'rgb(239, 154, 154)'
        case Power.Russia:
          return 'rgb(206, 147, 216)'
        case Power.France:
          return 'rgb(144, 202, 249)'
        case Power.Germany:
          return 'rgb(150, 150, 150)'
        case Power.Italy:
          return 'rgb(159, 168, 218)'
        case Power.Austria:
          return 'rgb(255, 224, 130)'
        case Power.Turkey:
          return 'rgb(255, 171, 145)'
      }
    }
  }
  const stringify = {
    fromState: (state) => `${state.turn.year}-${Season[state.turn.season]} (${Phase[state.phase]})`
  }
  const configs = {}
  viz = new vizdip.StandardRuleVisualizer(svgs, board.map, colors, stringify, configs)

  // Initialize interfaces
  createOrderPanel()
  createOrderList()
  viz.visualizeBoard(board)

  // Add event listeners
  document.getElementById('resolve').addEventListener('click', () => resolve())

  // Adjust width of map image
  document.getElementById('map-col').addEventListener('resize', adjustMap)
  adjustMap()

  document.getElementById('unit-images').style.display = 'none'
}

window.initialize = initialize
