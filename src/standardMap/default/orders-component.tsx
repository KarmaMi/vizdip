import * as React from "react"
import * as diplomacy from "js-diplomacy"

import { UnitComponent } from "./units-component"
import { standardRule } from "./../../standardRule"
import { Point } from "../../util"

import { provincePositionOf, locationPositionOf } from "./position"
import { size, colors } from "./configs"

export class OrdersComponent extends standardRule.OrdersComponent<diplomacy.standardMap.Power> {
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
  protected colors: standardRule.OrdersIconColors = colors
  protected size = size
  protected Unit = UnitComponent
}
