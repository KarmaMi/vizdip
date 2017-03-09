import * as React from "react"
import * as ReactDom from "react-dom"
import * as diplomacy from "js-diplomacy"
import { EventTarget } from "./event-target"

export interface BoardComponentProps<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus> {
  board: diplomacy.board.Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>
  orders: Set<diplomacy.rule.Order<Power, MilitaryBranch>>
  onProvince?: (event: EventTarget, province: diplomacy.board.Province<Power>) => void
  onUnit?: (event: EventTarget, unit: diplomacy.board.Unit<Power, MilitaryBranch>) => void
}

export declare type BoardComponent<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>
  = React.Component<BoardComponentProps<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>, {}>
