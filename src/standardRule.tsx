import * as React from "react"
import * as ReactDom from "react-dom"
import * as diplomacy from "js-diplomacy"
import { EventTarget } from "./event-target"
import * as Svg from "./util"
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

  export interface OrdersIconColors {
    fill: string
    margin: string
    border: string
    dislodged: string
  }

  export interface OrdersIconSize {
    unitRadius: number
    strokeWidth: number
    marginStrokeWidth: number
    arrowHeadLength: number
  }

  export interface OrdersComponentProps<Power> {
    orders: Set<diplomacy.standardRule.Order.Order<Power>>
  }

  export abstract class OrdersComponent<Power> extends React.Component<OrdersComponentProps<Power>, {}> {
    render() {
      const destPosition =
        (pos: Svg.Point, theta: number, l: number) => {
          return {
            x: pos.x + l * Math.cos(theta),
            y: pos.y + l * Math.sin(theta)
          }
        }

      const orders = Array.from(this.props.orders).map(order => {
        const position =
          this.locationPositionOf(order.unit.location, order.tpe === diplomacy.standardRule.Order.OrderType.Retreat)
        if (order instanceof diplomacy.standardRule.Order.Hold) {
          return <Svg.Circle
            center={position}
            r={this.size.unitRadius}
            strokeWidth={this.size.strokeWidth}
            fill={"none"}
            stroke={this.colors.fill}
            key={order.toString()}
            />
        }
        if (
          (order instanceof diplomacy.standardRule.Order.Move) ||
          (order instanceof diplomacy.standardRule.Order.Retreat)
        ) {
          const o: diplomacy.standardRule.Order.Retreat<Power>= order
          const dest = this.locationPositionOf(o.destination, false)
          const theta = Math.atan2(dest.y - position.y, dest.x - position.x)
          const d =
            destPosition(dest, theta, -this.size.arrowHeadLength + this.size.marginStrokeWidth * 2)
          return <g key={o.toString()}>
            <Svg.ArrowHead
              src={position} dest={dest}
              headLength={this.size.arrowHeadLength}
              strokeWidth={this.size.marginStrokeWidth}
              fillColor={this.colors.fill}
              strokeColor={this.colors.margin}
              />
            <Svg.Line
              from={position}
              dest={d}
              stroke={this.colors.margin}
              strokeWidth={this.size.strokeWidth + this.size.marginStrokeWidth * 2}
              />
            <Svg.Line
              from={position}
              dest={d}
              stroke={this.colors.fill}
              strokeWidth={this.size.strokeWidth}
              />
          </g>
        }
        if (order instanceof diplomacy.standardRule.Order.Support) {
          const o: diplomacy.standardRule.Order.Support<Power> =  order
          const dest = this.locationPositionOf(o.destination, false)
          if (o.target instanceof diplomacy.standardRule.Order.Move) {
            const ctrl = this.locationPositionOf(o.target.unit.location, false)
            const theta = Math.atan2(dest.y - ctrl.y, dest.x - ctrl.x)
            const d =
              destPosition(dest, theta, -this.size.arrowHeadLength + this.size.marginStrokeWidth * 2)

            return <g key={o.toString()}>
              <Svg.ArrowHead
                src={ctrl} dest={dest}
                headLength={this.size.arrowHeadLength}
                strokeWidth={this.size.marginStrokeWidth}
                fillColor={this.colors.fill}
                strokeColor={this.colors.margin}
                />
              <Svg.Line
                from={position}
                dest={d}
                ctrl={ctrl}
                stroke={this.colors.fill}
                strokeWidth={this.size.strokeWidth}
                strokeDasharray={"2, 2"}/>
            </g>
          } else if (o.target instanceof diplomacy.standardRule.Order.Hold) {
            const theta = Math.atan2(dest.y - position.x, dest.x - position.x)
            const d =
              destPosition(dest, theta, -this.size.arrowHeadLength + this.size.marginStrokeWidth * 2)

            return <g key={o.toString()}>
              <Svg.ArrowHead
                src={position} dest={dest}
                headLength={this.size.arrowHeadLength}
                strokeWidth={this.size.marginStrokeWidth}
                fillColor={this.colors.fill}
                strokeColor={this.colors.margin}
                />
              <Svg.Line
                from={position}
                dest={d}
                stroke={this.colors.fill}
                strokeWidth={this.size.strokeWidth}
                strokeDasharray={"2, 2"}/>
            </g>
          }
        }
        if (order instanceof diplomacy.standardRule.Order.Convoy) {
          const o: diplomacy.standardRule.Order.Convoy<Power> = order
          const dest = this.locationPositionOf(o.target.destination, false)
          const from = this.locationPositionOf(o.target.unit.location, false)
          const theta = Math.atan2(dest.y - from.y, dest.x - from.x)
          const d =
            destPosition(dest, theta, -this.size.arrowHeadLength + this.size.marginStrokeWidth * 2)

          return <g key={o.toString()}>
            <Svg.ArrowHead
              src={position} dest={dest}
              headLength={this.size.arrowHeadLength}
              strokeWidth={this.size.marginStrokeWidth}
              fillColor={this.colors.fill}
              strokeColor={this.colors.margin}
              />
            <Svg.Line
              from={from}
              dest={d}
              ctrl={position}
              stroke={this.colors.fill}
              strokeWidth={this.size.strokeWidth}
              strokeDasharray={"5, 2"}/>
          </g>
        }
        if (order instanceof diplomacy.standardRule.Order.Disband) {
          const o: diplomacy.standardRule.Order.Disband<Power> = order
          const p2 = {
            x: position.x - this.size.unitRadius * Math.cos(Math.PI / 4),
            y: position.y - this.size.unitRadius * Math.sin(Math.PI / 4)
          }
          const p3 = {
            x: position.x + this.size.unitRadius * Math.cos(Math.PI / 4),
            y: position.y + this.size.unitRadius * Math.sin(Math.PI / 4)
          }
          return <Svg.Line
            key={o.toString()}
            from={p2} dest={p3} stroke={this.colors.fill} strokeWidth={this.size.strokeWidth}/>
        }
        if (order instanceof diplomacy.standardRule.Order.Build) {
          const o: diplomacy.standardRule.Order.Build<Power> = order
          return <g opacity={0.5} key={o.toString()}>
            <this.Unit unit={{unit: o.unit, status: null }}/>
          </g>
        }
      })
      return <g>{orders}</g>
    }

    protected abstract Unit: new (props: UnitProps<Power>) => React.Component<UnitProps<Power>, {}>
    protected abstract colors: OrdersIconColors
    protected abstract size: OrdersIconSize
    protected abstract provincePositionOf (
      province: diplomacy.board.Province<Power>
    ): Svg.Point
    protected abstract locationPositionOf (
      location: diplomacy.standardRule.Location<Power>, isDislodged: boolean
    ): Svg.Point
  }

  export interface UnitWithStatus<Power> {
    unit: diplomacy.standardRule.Unit<Power>
    status: diplomacy.standardRule.Dislodged<Power> | null
  }

  export interface UnitProps<Power> {
    unit: UnitWithStatus<Power>
    on?: (event: EventTarget) => void
  }

  export interface UnitsComponentProps<Power> {
    units: Set<UnitWithStatus<Power>>
    on?: (event: EventTarget, unit: diplomacy.standardRule.Unit<Power>) => void
  }
  export declare type UnitsComponent<Power> = React.Component<UnitsComponentProps<Power>, {}>

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
        <this.MapComponent
          on={this.props.onProvince}
          map={this.props.board.map}
          provinces={provinces}/>
        <this.UnitsComponent
          on={this.props.onUnit}
          units={units}/>
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
