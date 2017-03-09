import * as React from "react"
import * as ReactDom from "react-dom"
import * as diplomacy from "js-diplomacy"

export interface BoardComponentProps<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus> {
  board: diplomacy.board.Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>
  orders: Set<diplomacy.rule.Order<Power, MilitaryBranch>>
}

export declare type BoardComponent<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>
  = React.Component<BoardComponentProps<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>, {}>
