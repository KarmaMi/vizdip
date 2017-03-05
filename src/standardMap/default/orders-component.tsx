import * as React from "react"
import * as diplomacy from "js-diplomacy"

import { UnitComponent } from "./units-component"
import { Colors, OrdersComponent as BaseOrdersComponent } from "./../../standardRule/orders-component"

import { provincePositionOf, locationPositionOf } from "./position"
import { size, colors } from "./configs"

export class OrdersComponent extends BaseOrdersComponent<diplomacy.standardMap.Power> {
  protected locationPositionOf (
    location: diplomacy.standardRule.Location<diplomacy.standardMap.Power>, isDislodged: boolean
  ): { x: number, y: number } {
    return locationPositionOf(location, isDislodged)
  }
  protected provincePositionOf (
    province: diplomacy.board.Province<diplomacy.standardMap.Power>
  ): { x: number, y: number } {
    return provincePositionOf(province)
  }
  protected colors: Colors = colors
  protected size = size
  protected Unit = UnitComponent
}
