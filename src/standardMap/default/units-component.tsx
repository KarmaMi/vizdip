import * as React from "react"
import * as diplomacy from "js-diplomacy"

import { Colors, UnitComponent as BaseUnitComponent } from "./unit-component"
import { UnitsComponent as BaseUnitsComponent } from "./../../standardRule/units-component"
import { Point } from "../../util"

import { provincePositionOf, locationPositionOf } from "./position"
import { size, colors } from "./configs"

export class UnitComponent extends BaseUnitComponent<diplomacy.standardMap.Power> {
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
  protected colors: Colors<diplomacy.standardMap.Power> = colors
  protected size = size
}

export class UnitsComponent extends BaseUnitsComponent<diplomacy.standardMap.Power> {
  protected Unit = UnitComponent
}
