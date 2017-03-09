import * as React from "react"
import * as diplomacy from "js-diplomacy"

import { UnitComponent } from "./units-component"
import { OrdersComponent as BaseOrdersComponent } from "./../../standardRule/orders-component"

import { provincePositionOf, locationPositionOf } from "./position"
import { size, colors } from "./configs"

const Season = diplomacy.standardBoard.Season
const Phase = diplomacy.standardRule.Phase

export interface StateProps {
  state: diplomacy.standardRule.State
}

export class StateComponent extends React.Component<StateProps, {}> {
  render () {
    return <g>
      <rect x="1" y="1" height="30" width="250" fill="white" stroke="black" strokeWidth="1" />
      <text
        y="20" x="10"
        style={{
          fontStyle: "normal",
          fontVariant: "normal",
          fontWeight: "bold",
          fontStretch: "normal",
          fontSize: "16px",
          fontFamily: "sans-serif",
          letterSpacing: "0px",
          wordSpacing: "0px",
          display: "inline",
          fill: "#000000",
          fillOpacity: 1,
          stroke: "#ffffff",
          strokeWidth: 0.5,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          strokeMiterlimit: 4,
          strokeDasharray: "none",
          strokeOpacity:1
        }}><tspan y="20" x="5">{this.stringify(this.props.state)}</tspan></text>
    </g>
  }
  protected stringify(state: diplomacy.standardRule.State): string {
    if (state.turn instanceof diplomacy.standardBoard.Turn) {
      return `${state.turn.year}-${Season[state.turn.season]} (${Phase[state.phase]})`
    } else {
      return state.toString()
    }
  }
}
