'use strict'

const Visualizer = require('./visualizer')

const diplomacy = (window && window.diplomacy) ? window.diplomacy : require('js-diplomacy')
const MilitaryBranch = diplomacy.variant.standard.rule.MilitaryBranch

const defaultBackground = 'rgb(129, 199, 132)'
const defaultDislodgedColor = 'red'
const defaultDislodgedBorderColor = 'black'
const defaultOrderColor = 'black'
const defaultOrderStrokeWidth = 2
const defaultOrderMarginColor = 'white'
const defaultOrderMarginStrokeWidth = 0.5
const defaultStandoffColor = 'white'
const defaultStandoffBorderColor = 'black'
const defaultStandoffRadius = 10
const defaultStandoffWidth = 3
const defaultStandoffMarginWidth = 0.5

function apply (matrix, v) {
  return [
    matrix.a * v[0] + matrix.c * v[1] + matrix.e,
    matrix.b * v[0] + matrix.d * v[1] + matrix.f
  ]
}

function removeAllChild (elem) {
  while (elem.firstChild) elem.removeChild(elem.firstChild)
}

module.exports = class StandardRuleVisualizer extends Visualizer {
  constructor (mapSvg, map, powerColor, armySvg, fleetSvg, configs) {
    super(mapSvg)

    this.configs = configs || {}
    this.powerColor = powerColor
    this.armySvg = armySvg
    this.fleetSvg = fleetSvg

    // provinces
    map.provinces.forEach(province => {
      const supplyCenterSvg = mapSvg.getElementById(`${province.name.toString()}/supply_center`)
      if (province.isSupplyCenter) {
        supplyCenterSvg.style.display = 'inline'
      } else {
        supplyCenterSvg.style.display = 'none'
      }
    })
  }

  getCenterPosition (target, idDislodged) {
    const positionElem = (target.province)
      // The target is an instance of Location
      ? (idDislodged
        ? this.map.getElementById(`${target.province.name}/${target}/dislodged_position`)
        : this.map.getElementById(`${target.province.name}/${target}/position`)
      )
      // The target is an instance of Province
      : this.map.getElementById(`${target.name}/position`)
    return [positionElem.cx.baseVal.value, positionElem.cy.baseVal.value]
  }

  visualizeProvince (province, status) {
    const backgroundSvg = this.map.getElementById(`${province.name}/background`)
    if (backgroundSvg.classList.contains('vizdip-fix-color')) {
      return
    }

    const color = (status && status.occupied)
      ? this.powerColor.get(status.occupied)
      : (this.configs.defaultBackground || defaultBackground)
    backgroundSvg.style.fill = color
    backgroundSvg.style.stroke = color

    if (status && status.standoff) {
      const standoffBorderColor = this.configs.standoffBorderColor || defaultStandoffBorderColor
      const standoffColor = this.configs.standoffColor || defaultStandoffColor
      const standoffWidth = this.configs.standoffWidth || defaultStandoffWidth
      const standoffMarginWidth = this.configs.standoffMarginWidth || defaultStandoffMarginWidth
      const standoffRadius = this.configs.standoffRaduis || defaultStandoffRadius

      const [cx, cy] = this.getCenterPosition(province, false)
      const standoff = this.map.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      const s = standoffWidth / 2
      const r = standoffRadius
      standoff.setAttribute(
        'points',
        `${s},${r} ${s},${s} ${r},${s} ${r},${-s} ${s},${-s} ${s},${-r} ` +
        `${-s},${-r} ${-s},${-s} ${-r},${-s} ${-r},${s} ${-s},${s} ${-s},${r}`
      )

      standoff.setAttribute('stroke', standoffBorderColor)
      standoff.setAttribute('stroke-width', standoffMarginWidth)
      standoff.setAttribute('fill', standoffColor)
      standoff.setAttribute('transform', `translate(${cx},${cy}), rotate(45)`)
      this.map.getElementById('status').appendChild(standoff)
    }
  }

  visualizeUnit (unit, status) {
    const location = unit.location
    const tpe = unit.militaryBranch

    // Prepare an element for unit
    const unitSvg = ((tpe === MilitaryBranch.Army) ? this.armySvg : this.fleetSvg).cloneNode(true)
    unitSvg.setAttribute('class', 'vizdip-unit')
    const color = this.powerColor.get(unit.power)
    function fillColor (dom) {
      ([...(dom.children)]).forEach(child => fillColor(child))
      if (!dom.classList.contains('vizdip-fix-color')) {
        dom.style.fill = color
      }
    }
    fillColor(unitSvg)

    // Get position
    const [cx, cy] = this.getCenterPosition(location, status)

    unitSvg.setAttribute('id', `${unit.power}/${unit}`)
    if (status) {
      // dislodged
      this.map.getElementById('dislodged_unit').appendChild(unitSvg)
    } else {
      // otherwise
      this.map.getElementById('unit').appendChild(unitSvg)
    }

    const bbox = unitSvg.getBBox()
    unitSvg.setAttribute('transform', `translate(${cx - bbox.width / 2}, ${cy - bbox.height / 2})`)
    if (status) {
      const r = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height) / 2

      const dislodgedBorderColor = this.configs.dislodgedBorderColor || defaultDislodgedBorderColor
      const dislodgedColor = this.configs.dislodgedColor || defaultDislodgedColor
      const orderColor = this.configs.orderClor || defaultOrderColor
      const orderStrokeWidth = this.configs.orderStrokeWidth || defaultOrderStrokeWidth

      const [cx2, cy2] = this.getCenterPosition(status.attackedFrom, false)
      const line = this.map.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', cx)
      line.setAttribute('y1', cy)
      line.setAttribute('x2', cx2)
      line.setAttribute('y2', cy2)
      line.setAttribute('stroke', orderColor)
      line.setAttribute('stroke-width', orderStrokeWidth)

      const circle = this.map.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('cx', cx)
      circle.setAttribute('cy', cy)
      circle.setAttribute('r', r)
      circle.setAttribute('stroke', dislodgedBorderColor)
      circle.setAttribute('stroke-width', orderStrokeWidth)
      circle.setAttribute('fill', dislodgedColor)
      this.map.getElementById('status').appendChild(line)
      this.map.getElementById('status').appendChild(circle)
    }
  }

  clearBoard () {
    removeAllChild(this.map.getElementById('status'))
    removeAllChild(this.map.getElementById('unit'))
    removeAllChild(this.map.getElementById('dislodged_unit'))
  }

  visualizeBoard (board) {
    this.clearBoard()

    // Visualize state
    this.map.getElementById('state/text').innerHTML =
      `${board.state.turn.year} ${board.state.turn.season} (${board.state.phase})`
    // Visualize provinces
    board.map.provinces.forEach(p => {
      const status = board.provinceStatuses.get(p)
      this.visualizeProvince(p, status)
    })
    // Visualize units
    board.units.forEach(u => {
      const status = board.unitStatuses.get(u)
      this.visualizeUnit(u, status)
    })
  }

  visualizeOrder (order) {
    const unitId = `${order.unit.power}/${order.unit}`
    if (!this.map.getElementById(unitId)) {
      this.visualizeUnit(order.unit, null)
    }

    const unitSvg = this.map.getElementById(unitId)
    const bbox = unitSvg.getBBox()
    const r = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height) / 2
    const [x1, y1] = apply(unitSvg.transform.baseVal[0].matrix, [0, 0])
    const cx1 = x1 + bbox.width / 2
    const cy1 = y1 + bbox.height / 2

    const orderSvg = this.map.getElementById('order')
    const orderColor = this.configs.orderColor || defaultOrderColor
    const orderArrowHeadLength = this.configs.orderArrowHeadLength || r / 2
    const orderMarginColor = this.configs.orderMarginColor || defaultOrderMarginColor
    const orderStrokeWidth = this.configs.orderStrokeWidth || defaultOrderStrokeWidth
    const orderMarginStrokeWidth = this.configs.orderMarginStrokeWidth || defaultOrderMarginStrokeWidth

    const getArrowHead = (x, y, x2, y2) => {
      const theta = Math.atan2(x - x2, y - y2) * 180 / Math.PI
      const marker = this.map.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      const l = Math.sqrt((x2 - x) * (x2 - x) + (y - y2) * (y - y2))
      const destX = orderArrowHeadLength * Math.tan(30 / 180 * Math.PI)
      marker.setAttribute(
        'points',
        `-${destX},${l - orderArrowHeadLength} 0,${l}, ${destX},${l - orderArrowHeadLength}`
      )
      marker.setAttribute('fill', orderColor)
      marker.setAttribute('stroke', orderMarginColor)
      marker.setAttribute('stroke-width', orderMarginStrokeWidth)
      marker.setAttribute('transform', `translate(${x2}, ${y2}), rotate(${-theta})`)
      return marker
    }

    const getLine = (src, ctrl, dst, tpe) => {
      const line1 = this.map.createElementNS('http://www.w3.org/2000/svg', 'path')
      line1.setAttribute('d', `M ${src[0]}, ${src[1]} Q ${ctrl[0]}, ${ctrl[1]} ${dst[0]}, ${dst[1]}`)
      line1.setAttribute(tpe[0], tpe[1])
      line1.setAttribute('stroke', orderColor)
      line1.setAttribute('stroke-width', orderStrokeWidth)
      line1.setAttribute('fill', 'none')
      return line1
    }

    const destPosition = (x, y, theta, l) => [x + l * Math.cos(theta), y + l * Math.sin(theta)]

    switch (order.tpe) {
      case 'Hold':
        (() => {
          const circle = this.map.createElementNS('http://www.w3.org/2000/svg', 'circle')
          circle.setAttribute('cx', cx1)
          circle.setAttribute('cy', cy1)
          circle.setAttribute('r', r)
          circle.setAttribute('stroke', orderColor)
          circle.setAttribute('stroke-width', orderStrokeWidth)
          circle.setAttribute('fill', 'none')
          orderSvg.appendChild(circle)
        })()
        break
      case 'Move':
      case 'Retreat':
        (() => {
          const [cx2, cy2] = this.getCenterPosition(order.destination, false)
          const theta = Math.atan2(cy2 - cy1, cx2 - cx1)
          const [dx, dy] =
            destPosition(cx2, cy2, theta, -orderArrowHeadLength + orderMarginStrokeWidth * 2)

          const line1 = this.map.createElementNS('http://www.w3.org/2000/svg', 'line')
          line1.setAttribute('x1', cx1)
          line1.setAttribute('y1', cy1)
          line1.setAttribute('x2', dx)
          line1.setAttribute('y2', dy)
          line1.setAttribute('stroke', orderColor)
          line1.setAttribute('stroke-width', orderStrokeWidth)
          const line2 = this.map.createElementNS('http://www.w3.org/2000/svg', 'line')
          line2.setAttribute('x1', cx1)
          line2.setAttribute('y1', cy1)
          line2.setAttribute('x2', dx)
          line2.setAttribute('y2', dy)
          line2.setAttribute('stroke', orderMarginColor)
          line2.setAttribute('stroke-width', orderStrokeWidth + orderMarginStrokeWidth * 2)
          const marker = getArrowHead(cx2, cy2, cx1, cy1)
          orderSvg.appendChild(marker)
          orderSvg.appendChild(line2)
          orderSvg.appendChild(line1)
        })()
        break
      case 'Support':
        (() => {
          if (order.target.tpe === 'Move') {
            const [cx2, cy2] = this.getCenterPosition(order.destination, false)
            const [cx3, cy3] = this.getCenterPosition(order.target.unit.location, false)
            const theta = Math.atan2(cy2 - cy3, cx2 - cx3)
            const [dx, dy] =
              destPosition(cx2, cy2, theta, -orderArrowHeadLength + orderMarginStrokeWidth * 2)

            const line = getLine([cx1, cy1], [cx3, cy3], [dx, dy], ['stroke-dasharray', '2, 2'])
            const marker = getArrowHead(cx2, cy2, cx3, cy3)
            orderSvg.appendChild(marker)
            orderSvg.appendChild(line)
          } else if (order.target.tpe === 'Hold') {
            const [cx2, cy2] = this.getCenterPosition(order.destination, false)
            const theta = Math.atan2(cy2 - cy1, cx2 - cx1)
            const [dx, dy] =
              destPosition(cx2, cy2, theta, -orderArrowHeadLength + orderMarginStrokeWidth * 2)

            const line = getLine([cx1, cy1], [cx1, cy1], [dx, dy], ['stroke-dasharray', '2, 2'])
            const marker = getArrowHead(cx2, cy2, cx1, cy1)
            orderSvg.appendChild(marker)
            orderSvg.appendChild(line)
          }
        })()
        break
      case 'Convoy':
        (() => {
          const [cx2, cy2] = this.getCenterPosition(order.target.destination, false)
          const [cx3, cy3] = this.getCenterPosition(order.target.unit.location, false)
          const theta = Math.atan2(cy2 - cy3, cx2 - cx3)
          const [dx, dy] =
            destPosition(cx2, cy2, theta, -orderArrowHeadLength + orderMarginStrokeWidth * 2)

          const line = getLine([cx3, cy3], [cx1, cy1], [dx, dy], ['stroke-dasharray', '5, 2'])
          const marker = getArrowHead(cx2, cy2, cx3, cy3)
          orderSvg.appendChild(marker)
          orderSvg.appendChild(line)
        })()
        break
      case 'Disband':
        (() => {
          const [x2, y2] = [cx1 - r * Math.cos(Math.PI / 4), cy1 - r * Math.sin(Math.PI / 4)]
          const [x3, y3] = [cx1 + r * Math.cos(Math.PI / 4), cy1 + r * Math.sin(Math.PI / 4)]
          const line = this.map.createElementNS('http://www.w3.org/2000/svg', 'line')
          line.setAttribute('x1', x2)
          line.setAttribute('y1', y2)
          line.setAttribute('x2', x3)
          line.setAttribute('y2', y3)
          line.setAttribute('stroke', orderColor)
          line.setAttribute('stroke-width', orderStrokeWidth)
          orderSvg.appendChild(line)
        })()
        break
      case 'Build':
        (() => {
          // If there is an invalid unit, delete it
          if (order.unit.militaryBranch === MilitaryBranch.Army) {
            const e = this.map.getElementById(`${order.unit.power}/F ${order.unit.location}`)
            if (e) e.remove()
          } else if (order.unit.militaryBranch === MilitaryBranch.Fleet) {
            const e = this.map.getElementById(`${order.unit.power}/A ${order.unit.location}`)
            if (e) e.remove()
          }

          unitSvg.setAttribute('opacity', '0.5')
        })()
        break
    }
  }

  clearOrder () {
    removeAllChild(this.map.getElementById('order'))
  }
  visualizeOrders (orders) {
    this.clearOrder()
    orders.forEach(order => this.visualizeOrder(order))
  }
}
