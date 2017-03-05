import * as React from "react"
import * as diplomacy from "js-diplomacy"
import { EventTarget } from "../event-target"

export interface UnitWithStatus<Power> {
  unit: diplomacy.standardRule.Unit<Power>
  status: diplomacy.standardRule.Dislodged<Power> | null
}

export interface UnitProps<Power> {
  unit: UnitWithStatus<Power>
  on?: (event: EventTarget) => void
}

export interface Props<Power> {
  units: Set<UnitWithStatus<Power>>
  on?: (event: EventTarget, unit: diplomacy.standardRule.Unit<Power>) => void
}

export abstract class UnitsComponent<Power> extends React.Component<Props<Power>, {}> {
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

  protected abstract Unit: new (props: UnitProps<Power>) => React.Component<UnitProps<Power>, {}>
}
