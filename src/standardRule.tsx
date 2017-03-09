import * as React from "react"
import * as ReactDom from "react-dom"
import * as diplomacy from "js-diplomacy"
import { EventTarget } from "./event-target"

import * as OrdersComponentModule from "./standardRule/orders-component"
import * as UnitsComponentModule from "./standardRule/units-component"
import { BoardComponentProps } from "./board-component"

export namespace standardRule {
  export interface ProvinceWithStatus<Power> {
    province: diplomacy.board.Province<Power>
    status: diplomacy.standardRule.ProvinceStatus<Power> | null
  }
  export interface MapComponentProps<Power> {
    map: diplomacy.standardRule.DiplomacyMap<Power>
    provinces: Set<ProvinceWithStatus<Power>>
    on?: (event: EventTarget, province: diplomacy.board.Province<Power>) => void
  }
  export declare type MapComponent<Power> = React.Component<MapComponentProps<Power>, {}>

  export declare type StateComponent = React.Component<{ state: diplomacy.standardRule.State }, {}>

  export declare type OrdersIconColors = OrdersComponentModule.OrdersIconColors
  export declare type OrdersIconSize = OrdersComponentModule.OrdersIconSize
  export declare type OrdersComponentProps<Power> =
    OrdersComponentModule.OrdersComponentProps<Power>
  export abstract class OrdersComponent<Power>
    extends OrdersComponentModule.OrdersComponent<Power> {}

  export declare type UnitWithStatus<Power> = UnitsComponentModule.UnitWithStatus<Power>
  export declare type UnitProps<Power> = UnitsComponentModule.UnitProps<Power>
  export declare type UnitsComponentProps<Power> = UnitsComponentModule.UnitsComponentProps<Power>
  export abstract class UnitsComponent<Power> extends UnitsComponentModule.UnitsComponent<Power> {}

  export abstract class BoardComponent<Power>
    extends React.Component<BoardComponentProps<Power, diplomacy.standardRule.MilitaryBranch, diplomacy.standardRule.State, diplomacy.standardRule.Dislodged<Power>, diplomacy.standardRule.ProvinceStatus<Power>>, {}> {
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
      const orders = new Set(
        Array.from(this.props.orders)
          .filter(order => {
            return order instanceof diplomacy.standardRule.Order.Order
          }) as Array<diplomacy.standardRule.Order.Order<Power>>
      )
      return <svg width={`${this.width}px`} height={`${this.height}px`}>
        <this.MapComponent map={this.props.board.map} provinces={provinces}/>
        <this.UnitsComponent units={units}/>
        <this.OrdersComponent orders={orders}/>
        <this.StateComponent state={this.props.board.state} />
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

    protected abstract MapComponent: new (props: MapComponentProps<Power>) => MapComponent<Power>
    protected abstract UnitsComponent: new (props: UnitsComponentProps<Power>) => UnitsComponent<Power>
    protected abstract OrdersComponent: new (props: OrdersComponentProps<Power>) => OrdersComponent<Power>
    protected abstract StateComponent: new (props: { state: diplomacy.standardRule.State }) => StateComponent

    protected abstract width: number
    protected abstract height: number
  }
}
