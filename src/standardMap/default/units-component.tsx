import * as React from "react"
import * as diplomacy from "js-diplomacy"

import { standardRule } from "../../standardRule"
import { Colors, UnitImage } from "./unit-image"
import { Point } from "../../util"

import { provincePositionOf, locationPositionOf } from "./position"
import { size, colors } from "./configs"

export class UnitComponent extends UnitImage<diplomacy.standardMap.Power> {
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

export class UnitsComponent
  extends React.Component<standardRule.UnitsComponentProps<diplomacy.standardMap.Power>, {}> {
  render () {
    const units = Array.from(this.props.units)
      .filter(unit => unit.status === null)
      .map(elem => {
        const unit = elem.unit
        return <this.Unit
          key={unit.toString()}
          unit={elem}
          on={(event) => {
            if (this.props.on) {
              this.props.on(event, unit)
            }
          }}/>
      })
    const dislodgedUnits = Array.from(this.props.units)
      .filter(unit => unit.status !== null)
      .map(elem => {
        const unit = elem.unit
        return <this.Unit
          key={`${unit}-dislodged}`}
          unit={elem}
          on={(event) => {
            if (this.props.on) {
              this.props.on(event, unit)
            }
          }}/>
      })

    return <g>
      {units}
      {dislodgedUnits}
    </g>
  }
  Unit = UnitComponent
}
