import * as React from "react"
import * as diplomacy from "js-diplomacy"

import { UnitComponent } from "./units-component"
import { OrdersIconColors, OrdersComponent as BaseOrdersComponent } from "./../../standardRule/orders-component"
import { Point } from "../../util"

import { provincePositionOf, locationPositionOf } from "./position"
import { size, colors } from "./configs"

export class OrdersComponent extends BaseOrdersComponent<diplomacy.standardMap.Power> {
  protected locationPositionOf (
    location: diplomacy.standardRule.Location<diplomacy.standardMap.Power>, isDislodged: boolean
  ): Point {
    return locationPositionOf(location, isDislodged)
  }
  protected provincePositionOf (
    province: diplomacy.board.Province<diplomacy.standardMap.Power>
  ): Point {
    return provincePositionOf(province)
  }
  protected colors: OrdersIconColors = colors
  protected size = size
  protected Unit = UnitComponent
}
