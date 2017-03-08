import * as React from "react"
import * as diplomacy from "js-diplomacy"
import { EventTarget } from "../event-target"
import { UnitProps } from "./units-component"
import * as Svg from "../util"

export interface Colors {
  fill: string
  margin: string
  border: string
  dislodged: string
}

export interface Size {
  unitRadius: number
  strokeWidth: number
  marginStrokeWidth: number
  arrowHeadLength: number
}

export interface Props<Power> {
  orders: Set<diplomacy.standardRule.Order.Order<Power>>
}

export abstract class OrdersComponent<Power> extends React.Component<Props<Power>, {}> {
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
  protected abstract colors: Colors
  protected abstract size: Size
  protected abstract provincePositionOf (
    province: diplomacy.board.Province<Power>
  ): Svg.Point
  protected abstract locationPositionOf (
    location: diplomacy.standardRule.Location<Power>, isDislodged: boolean
  ): Svg.Point
}
