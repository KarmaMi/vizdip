import * as React from "react"
import * as ReactDom from "react-dom"
import * as diplomacy from "js-diplomacy"

import { standardMap } from "../../src/vizdip"

type Board = diplomacy.standardRule.Board<diplomacy.standardMap.Power>
type Order = diplomacy.standardRule.Order.Order<diplomacy.standardMap.Power>
type Location = diplomacy.standardRule.Location<diplomacy.standardMap.Power>
type Phase = diplomacy.standardRule.Phase
const Phase = diplomacy.standardRule.Phase
type OrderType = diplomacy.standardRule.Order.OrderType
const OrderType = diplomacy.standardRule.Order.OrderType
type MilitaryBranch = diplomacy.standardRule.MilitaryBranch
const MilitaryBranch = diplomacy.standardRule.MilitaryBranch

const Helper = diplomacy.standardRule.Helper
const Utils = diplomacy.standardRule.Utils

function stringify (order: Order): string {
  if (order instanceof diplomacy.standardRule.Order.Move || order instanceof diplomacy.standardRule.Order.Retreat) {
    return `${order.unit} ${String.fromCharCode(0x2192)} ${order.destination}`
  } else if (order instanceof diplomacy.standardRule.Order.Support) {
    return `${order.unit} S ${stringify(order.target)}`
  } else if (order instanceof diplomacy.standardRule.Order.Convoy) {
    return `${order.unit} C ${stringify(order.target)}`
  } else {
    return order.toString()
  }
}

class LocationSelector
  extends React.Component<{ candidates: Array<Location | null>, on?: () => void }, {}> {
  render () {
    const targetOptions = this.props.candidates.map(l => {
      if (l === null) {
        return <option key={"null"}></option>
      } else {
        return <option key={l.toString()}>{l.toString()}</option>
      }
    })
    return <select
      className={"select-picker"}
      disabled={this.props.candidates.length <= 1}
      onChange={() => {
        if (this.props.on) {
          this.props.on()
        }
      }}
      ref={(selector) => { this.selector = selector }}
    >
      {targetOptions}
    </select>
  }

  get () {
    return this.props.candidates[this.selector.selectedIndex]
  }
  private selector: HTMLSelectElement
}

class OrderTypeSelector
  extends React.Component<{ candidates: Array<OrderType>, on?: () => void }, {}> {
  constructor (props: { candidates: Array<OrderType> }) {
    super (props)
    console.assert(props.candidates.length !== 0)
    this.state = { tpe: props.candidates[0] }
  }

  render () {
    const options = this.props.candidates.map(tpe => {
      const [key, name] = this.stringify(tpe)
      return <option key={key} value={key}>{name}</option>
    })
    return <select
      key={"orderType"}
      className={"select-picker"}
      disabled={this.props.candidates.length <= 1}
      onChange={() => {
        if (this.props.on) {
          this.props.on()
        }
      }}
      ref={(selector) => { this.selector = selector }}
    >
      {options}
    </select>
  }

  get () {
    return this.props.candidates[this.selector.selectedIndex]
  }
  private selector: HTMLSelectElement

  private fromString (str: string) {
    switch (str) {
      case "M":
        return OrderType.Move
      case "H":
        return OrderType.Hold
      case "S":
        return OrderType.Support
      case "C":
        return OrderType.Convoy
      case "R":
        return OrderType.Retreat
      case "D":
        return OrderType.Disband
      case "B":
        return OrderType.Build
    }
    return null
  }

  private stringify (tpe: OrderType) {
    switch (tpe) {
      case OrderType.Hold:
        return ["H", "H"]
      case OrderType.Move:
        return ["M", String.fromCharCode(0x2192)]
      case OrderType.Support:
        return ["S", "S"]
      case OrderType.Convoy:
        return ["C", "C"]
      case OrderType.Retreat:
        return ["R", String.fromCharCode(0x2192)]
      case OrderType.Disband:
        return ["D", "Disband"]
      case OrderType.Build:
        return ["B", "Build"]
    }
  }
}

class MilitaryBranchSelector
  extends React.Component<{ candidates: Array<MilitaryBranch | null>, on?: () => void }, {}> {
  render () {
    const targetOptions = this.props.candidates.map(l => {
      if (l === null) {
        return <option key={"null"}></option>
      } else {
        return <option key={l.toString()}>{MilitaryBranch[l]}</option>
      }
    })
    return <select
      className={"select-picker"}
      disabled={this.props.candidates.length <= 1}
      onChange={() => {
        if (this.props.on) {
          this.props.on()
        }
      }}
      ref={(selector) => { this.selector = selector }}
    >
      {targetOptions}
    </select>
  }

  get () {
    return this.props.candidates[this.selector.selectedIndex]
  }
  private selector: HTMLSelectElement
}

class OrderSelector extends React.Component<{ candidates: Array<Order | null>, on?: () => void }, {}> {
  render () {
    const targetOptions = this.props.candidates.map(o => {
      if (o === null) {
        return <option key={"null"}></option>
      } else {
        return <option key={o.toString()}>{stringify(o)}</option>
      }
    })
    return <select
      className={"select-picker"}
      disabled={this.props.candidates.length <= 1}
      onChange={() => {
        if (this.props.on) {
          this.props.on()
        }
      }}
      ref={(selector) => { this.selector = selector }}
    >
      {targetOptions}
    </select>
  }
  get () {
    return this.props.candidates[this.selector.selectedIndex]
  }
  private selector: HTMLSelectElement
}

interface OrderItemProps {
  power: diplomacy.standardMap.Power
  board: Board
  location: Location | null
  on?: (order: Order | null) => void
}
interface OrderItemState {
  location: Location | null
  orderType: OrderType | null
  orders: Set<Order>
}
class OrderItem extends React.Component<OrderItemProps, OrderItemState> {
  constructor (props: OrderItemProps) {
    super(props)
    this.state = {
      location: null,
      orderType: null,
      orders: new Set()
    }
  }
  render () {
    let locationCandidates: Array<Location | null> = []
    let orderTypeCandidates: Array<OrderType> = []

    switch (this.props.board.state.phase) {
      case Phase.Movement:
        (() => {
          if (this.props.location) {
            locationCandidates = [this.props.location]
          } else {
            const u = Array.from(this.props.board.units)
              .filter(x => x.power === this.props.power)
              .map(x => x.location as (Location | null))
            u.unshift(null)
            locationCandidates = u
          }
          orderTypeCandidates = [
            diplomacy.standardRule.Order.OrderType.Hold,
            diplomacy.standardRule.Order.OrderType.Move,
            diplomacy.standardRule.Order.OrderType.Support,
            diplomacy.standardRule.Order.OrderType.Convoy
          ]
        })()
        break
      case diplomacy.standardRule.Phase.Retreat:
        (() => {
          if (this.props.location) {
            locationCandidates = [this.props.location]
          } else {
            const u = Array.from(this.props.board.units)
              .filter(x => x.power === this.props.power)
              .filter(x => this.props.board.unitStatuses.get(x) !== null)
              .map(x => x.location as (Location | null))
            u.unshift(null)
            locationCandidates = u
          }
          orderTypeCandidates = [
            diplomacy.standardRule.Order.OrderType.Disband,
            diplomacy.standardRule.Order.OrderType.Retreat
          ]
        })()
        break
      case Phase.Build:
        (() => {
          const isBuildable =
            (Utils.numberOfBuildableUnits(this.props.board).get(this.props.power) || 0) > 0

          if (isBuildable) {
            locationCandidates =
              Array.from(this.props.board.map.locations)
                .filter(x => x.province.homeOf === this.props.power)
                .filter(x => x.province.isSupplyCenter)
                .filter(x => {
                  const status = this.props.board.provinceStatuses.get(x.province)
                  return status && status.occupied === this.props.power
                })
            locationCandidates.unshift(null)
            orderTypeCandidates = [
              diplomacy.standardRule.Order.OrderType.Build
            ]
          } else {
            locationCandidates =
              Array.from(this.props.board.units)
                .filter(x => x.power === this.props.power)
                .map(x => x.location)
            locationCandidates.unshift(null)
            orderTypeCandidates = [
              diplomacy.standardRule.Order.OrderType.Disband
            ]
          }
        })()
        break
    }

    let destination: Array<JSX.Element> = []
    const $$ = new Helper(this.props.board)
    switch (this.state.orderType) {
      case OrderType.Hold:
      case OrderType.Disband:
        break
      case OrderType.Move:
        (() => {
          if (this.state.location) {
            const candidates =
              Array.from(
                Utils.movableLocationsOf(this.props.board, $$.U(this.state.location).unit)
              ) as Array<Location | null>
            candidates.unshift(null)
            destination = [
              <LocationSelector
                key="location"
                candidates={candidates}
                on={() => this.on()}
                ref={(selector) => { this.destinationLocationSelector = selector }}/>
            ]
          }
        })()
        break
      case OrderType.Support:
        (() => {
          if (this.state.location) {
            const supportable =
              Utils.supportableLocationsOf(this.props.board.map, $$.U(this.state.location).unit)
            const orders = Array.from(this.state.orders)
              .filter(order => order.unit.location !== this.state.location)
              .filter(order => {
                if (order instanceof diplomacy.standardRule.Order.Move) {
                  return supportable.has(order.destination)
                } else {
                  return supportable.has(order.unit.location)
                }
              }).map(order => {
                if (order instanceof diplomacy.standardRule.Order.Move) {
                  return order
                } else {
                  return new diplomacy.standardRule.Order.Hold(order.unit)
                }
              }) as Array<Order | null>
            orders.unshift(null)
            destination = [
              <OrderSelector
                key="order"
                candidates={orders}
                on={() => this.on()}
                ref={(selector) => { this.orderSelector = selector }}/>
            ]
          }
        })()
        break
      case OrderType.Convoy:
        (() => {
          if (this.state.location) {
            const orders = Array.from(this.state.orders)
              .filter(order => order.tpe === OrderType.Move) as Array<Order | null>
            orders.unshift(null)
            destination = [
              <OrderSelector
                key="order"
                candidates={orders}
                on={() => this.on()}
                ref={(selector) => { this.orderSelector = selector }}/>
            ]
          }
        })()
        break
      case OrderType.Retreat:
        (() => {
          if (this.state.location) {
            const u = $$.U(this.state.location).unit
            const status = this.props.board.unitStatuses.get(u)
            if (status) {
              const candidates =
                Array.from(
                  Utils.locationsToRetreat(this.props.board, u, status.attackedFrom)
                ) as Array<Location | null>
              candidates.unshift(null)
              destination = [
                <LocationSelector
                  key="location"
                  candidates={candidates}
                  on={() => this.on()}
                  ref={(selector) =>{ this.destinationLocationSelector = selector }}/>
              ]
            }
          }
        })()
        break
      case OrderType.Build:
        (() => {
          if (this.state.location) {
            const militaryBranches = Array.from(
              this.state.location.militaryBranches
            ) as Array<MilitaryBranch | null>
            militaryBranches.unshift(null)
            destination = [
              <MilitaryBranchSelector
                key="militaryBranch"
                candidates={militaryBranches}
                on={() => this.on()}
                ref={(selector) => { this.militaryBranchSelector = selector }}/>
            ]
          }
        })()
        break
    }

    return <li className="list-group-item">
      <LocationSelector
        candidates={locationCandidates}
        on={() => this.on() }
        ref={(location) => { this.locationSelector = location }}/>
      <OrderTypeSelector
        candidates={orderTypeCandidates}
        on={() => this.on() }
        ref={(orderType) => { this.orderTypeSelector = orderType }}/>
      {destination}
    </li>
  }

  setOrders (orders: Set<Order>) {
    this.setState({
      location: this.locationSelector.get(),
      orderType: this.orderTypeSelector.get(),
      orders: orders
    })
  }

  get (): Order | null {
    const $$ = new Helper(this.props.board)
    const l = this.locationSelector.get()
    const t = this.orderTypeSelector.get()
    switch (t) {
      case OrderType.Hold:
        if (l) {
          return $$.U(l).hold()
        }
        break
      case OrderType.Move:
        if (this.destinationLocationSelector) {
          const l2 = this.destinationLocationSelector.get()
          if (l && l2) {
            return $$.U(l).move(l2)
          }
        }
        break
      case OrderType.Support:
        if (this.orderSelector) {
          const o = this.orderSelector.get()
          if (l && o) {
            return $$.U(l).support(o)
          }
        }
        break
      case OrderType.Convoy:
        if (this.orderSelector) {
          const o = this.orderSelector.get()
          if (l && o) {
            if (o instanceof diplomacy.standardRule.Order.Move) {
              return $$.U(l).convoy(o)
            }
          }
        }
        break
      case OrderType.Retreat:
        if (this.destinationLocationSelector) {
          const l2 = this.destinationLocationSelector.get()
          if (l && l2) {
            return $$.U(l).retreat(l2)
          }
        }
      case OrderType.Disband:
        if (l) {
          return $$.U(l).disband()
        }
        break
      case OrderType.Build:
        if (this.militaryBranchSelector) {
          const m = this.militaryBranchSelector.get()
          if (l && m) {
            switch (m) {
              case MilitaryBranch.Army:
                return $$.A(l).build()
              case MilitaryBranch.Fleet:
                return $$.F(l).build()
            }
          }
        }
        break
    }
    return null
  }
  private on (): void {
    this.setState({
      location: this.locationSelector.get(),
      orderType: this.orderTypeSelector.get(),
      orders: this.state.orders
    })

    if (this.props.on) {
      this.props.on(this.get())
    }
  }
  private locationSelector: LocationSelector
  private orderTypeSelector: OrderTypeSelector
  private destinationLocationSelector: LocationSelector | null
  private orderSelector: OrderSelector | null
  private militaryBranchSelector: MilitaryBranchSelector | null
}

interface OrdersProps {
  power: diplomacy.standardMap.Power
  board: Board
  on?: (orders: Set<Order>) => void
}
class PowerPanel extends React.Component<OrdersProps, {}> {
  constructor (props: OrdersProps) {
    super(props)
    this.orders = new Map()
  }
  render () {
    let elems: Array<JSX.Element> = []
    switch (this.props.board.state.phase) {
      case Phase.Movement:
        (() => {
          const us = Array.from(this.props.board.units).filter(x => x.power === this.props.power)
          elems = us.map((unit, index) => {
            return <OrderItem
              power={this.props.power}
              board={this.props.board}
              location={unit.location}
              key={unit.location.toString()}
              on={(order) => this.on(order)}
              ref={(selector) => this.orders.set(index, selector)}
              />
          })
        })()
        break
      case Phase.Retreat:
        (() => {
          const us = Array.from(this.props.board.units)
            .filter(x => x.power === this.props.power)
            .filter(x => this.props.board.unitStatuses.get(x) !== undefined)
          elems = us.map((unit, index) => {
            return <OrderItem
              power={this.props.power}
              board={this.props.board}
              location={unit.location}
              key={unit.location.toString()}
              on={(order) => this.on(order)}
              ref={(selector) => this.orders.set(index, selector)}
              />
          })
        })()
        break
      case Phase.Build:
        (() => {
          const num = Utils.numberOfBuildableUnits(this.props.board).get(this.props.power) || 0
          // Build
          for (let i = 0; i < Math.abs(num); i++) {
            elems.push(
              <OrderItem
                power={this.props.power}
                board={this.props.board}
                location={null}
                key={i}
                on={(order) => this.on(order)}
                ref={(selector) => this.orders.set(i, selector)}
                />
            )
          }
        })()
        break
    }
    return <div className="panel panel-default">
      <div className={"panel-heading"}>{diplomacy.standardMap.Power[this.props.power]}</div>
      <div className={"panel-body"}>{elems}</div>
    </div>
  }
  setOrders (orders: Set<Order>) {
    this.orders.forEach(item => {
      if (item) {
        item.setOrders(orders)
      }
    })
  }
  get () {
    const retval = new Set(Array.from(this.orders).map(x => {
      if (x[1]) {
        return x[1].get()
      } else {
        return null
      }
    }).filter(x => x))
    return retval as Set<Order>
  }
  private on (order: Order | null) {
    if (this.props.on) {
      this.props.on(this.get())
    }
  }
  private orders: Map<number, OrderItem>
}

class OrdersPanel extends React.Component<{ board: Board, on?: (orders: Set<Order>) => void }, {}> {
  constructor (props: { board: Board }) {
    super(props)
    this.powers = new Map()
  }
  render () {
    const powers = Array.from(this.props.board.map.powers)
      .map(power => {
        return <PowerPanel
          key={power}
          power={power}
          board={this.props.board}
          ref={(selector) => this.powers.set(power, selector)}
          on={(orders) => this.on()}/>
      })
    return <div>{powers}</div>
  }
  get (): Set<Order> {
    const os = new Set()
    this.powers.forEach(elem => {
      elem.get().forEach(order => os.add(order))
    })
    return os
  }
  private powers: Map<diplomacy.standardMap.Power, PowerPanel>
  private on() {
    const os = this.get()
    this.powers.forEach(elem => {
      elem.setOrders(os)
    })
    if (this.props.on) {
      this.props.on(os)
    }
  }
}

class Game extends React.Component<{}, { board: Board, orders: Set<Order> }> {
  constructor (props: {}) {
    super(props)
    this.state = { board: diplomacy.standard.variant.initialBoard, orders: new Set() }
  }
  render () {
    return <div className="container">
      <div className="page-header"><h1>Vizdip Example</h1></div>
      <div className="row">
        <div className="col-md-8" id="map-col">
          <div className="page-header">
            <h3>Map</h3>
          </div>
          <div>
            <standardMap.BoardComponent
              board={this.state.board}
              orders={this.state.orders}
              />
            </div>
        </div>
        <div className="col-md-4">
          <div className="page-header"><h3>Orders</h3></div>
          <OrdersPanel
            board={this.state.board}
            ref={(panel) => this.ordersPanel = panel}
            on={(orders) => this.setState({ board: this.state.board, orders: orders })}/>
          <div className="page-footer">
            <button
              type="button" id="resolve" className="btn btn-default" aria-label="Left Align"
              onClick={() => this.resolve()}>
              Resolve
            </button>
          </div>
        </div>
      </div>
    </div>
  }
  private ordersPanel: OrdersPanel
  private resolve () {
    const os = this.ordersPanel.get()
    const result = diplomacy.standard.variant.rule.resolve(this.state.board, os)

    if (result.result) {
      result.result.results.forEach(result => {
        console.log(`${result.target.toString()}: ${diplomacy.standardRule.Result[result.result]}`)
        if ((result as any).invalidReason) {
          console.log((result as any).invalidReason)
        }
      })
      this.setState({ board: result.result.board, orders: new Set() })
    } else if (result.err) {
      console.log(result.err)
    }
  }
}

function initialize () {
  ReactDom.render(<Game />, document.getElementById("example"))
}

(window as any).initialize = initialize
