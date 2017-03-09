import * as React from "react"
import * as ReactDom from "react-dom"
import * as diplomacy from "js-diplomacy"

import { standardRule } from "./../../standardRule"
import { MapComponent } from "./map-component"
import { UnitsComponent } from "./units-component"
import { OrdersComponent } from "./orders-component"
import { StateComponent } from "./state-component"

export class BoardComponent extends standardRule.BoardComponent<diplomacy.standardMap.Power> {
  protected MapComponent = MapComponent
  protected UnitsComponent = UnitsComponent
  protected OrdersComponent = OrdersComponent
  protected StateComponent = StateComponent
  protected width = 900
  protected height = 787
}
