import * as React from "react"
import * as ReactDom from "react-dom"
import * as diplomacy from "js-diplomacy"

import { MapComponent } from "./map-component"
import { UnitsComponent } from "./units-component"
import { OrdersComponent } from "./orders-component"
import { StateComponent } from "./state-component"

export interface Props {
  board: diplomacy.standardRule.Board<diplomacy.standardMap.Power>
  orders: Set<diplomacy.standardRule.Order.Order<diplomacy.standardMap.Power>>
}

export class BoardComponent extends React.Component<Props, {}> {
  render () {
    const provinces = new Set(
      Array.from(this.props.board.map.provinces).map(province => {
        return {
          province: province,
          status: this.props.board.provinceStatuses.get(province) || null
        }
      })
    )
    const units = new Set(
      Array.from(this.props.board.units).map(unit => {
        return {
          unit: unit,
          status: this.props.board.unitStatuses.get(unit) || null
        }
      })
    )
    return <svg width={`${this.width}px`} height={`${this.height}px`}>
      <MapComponent map={this.props.board.map} provinces={provinces}/>
      <UnitsComponent units={units}/>
      <OrdersComponent orders={this.props.orders}/>
      <StateComponent state={this.props.board.state} />
    </svg>
  }
  componentDidMount () {
    const svg = ReactDom.findDOMNode(this)

    if (svg.parentNode) {
      const adjust = () => {
        const rect = (svg.parentNode as HTMLElement).getBoundingClientRect()
        const wRatio = rect.width / this.width
        const hRatio = rect.height / this.height

        const ratio = Math.min(wRatio, hRatio);
        (svg as HTMLElement).setAttribute("width", this.width * ratio + "px");
        (svg as HTMLElement).setAttribute("height", this.height * ratio + "px");
        (svg as HTMLElement).setAttribute("transform", `scale(${ratio})`)
      }
      svg.parentNode.addEventListener("resise", adjust)
      adjust()
    }
  }

  private width = 900
  private height = 787
}
