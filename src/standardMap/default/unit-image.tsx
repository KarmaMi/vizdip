import * as React from "react"
import * as diplomacy from "js-diplomacy"

import { EventTarget } from "../../event-target"
import { UnitProps } from "../../standardRule/units-component"
import * as Svg from "../../util"

export interface Colors<Power> {
  power (power: Power): string
  fill: string
  border: string
  dislodged: string
}

export interface Size {
  unitRadius: number
  strokeWidth: number
}

export abstract class UnitImage<Power>
  extends React.Component<UnitProps<Power>, {}> {
  render () {
    const position = this.locationPositionOf(this.props.unit.unit.location, this.props.unit.status != null)
    const color = this.colors.power(this.props.unit.unit.power)
    let unitSvg = null

    switch (this.props.unit.unit.militaryBranch) {
      case diplomacy.standardRule.MilitaryBranch.Army:
        unitSvg = <g
          stroke={"#000"}
          transform={`translate(${position.x - 15}, ${position.y - 10})`}
          onClick={() => { if (this.props.on) { this.props.on(EventTarget.click) } }}
          onDoubleClick={() => { if (this.props.on) { this.props.on(EventTarget.dblclick) } }}
          onMouseDown={() => { if (this.props.on) { this.props.on(EventTarget.mousedown) } }}
          onMouseUp={() => { if (this.props.on) { this.props.on(EventTarget.mouseup) } }}
          key="unitSvg"
        >
          <rect
            ry={".8372916"} y={".31774175"} x={".31774175"} height={"20"} width={"30"}
            fill={color} strokeWidth={".6354835"} strokeLinecap={"round"}/>
          <g strokeWidth=".29421726" fill="#666">
            <path
              d={"M25.194083 2.1799024l.453912.6468885-1.280164.9174794.453909.6468885.640083-.4587382-.186159 1.1056297-7.68096 5.5048637.453907.646889-5.760719 4.12865.186158-1.105627-.45391-.646889-1.92024 1.376215-.2464438-.351261 1.9202378-1.376218-.661346-.942519z"}
              fillRule={"evenodd"}
              transform={"matrix(1.07958 0 0 1.08033 -.114 -.114)"}/>
            <path
              d={"M18.090316 11.555055l-2.354067 2.37911-9.4162672 3.965184H2.3965392l.7846879-1.586075H4.750606l.7846879.872341 12.5550221-5.63056"}
              fillRule={"evenodd"}
              transform={"matrix(1.07958 0 0 1.08033 -.114 -.114)"}/>
            <path
              d={"M17.599775 6.0118803v.00218c-1.579084.042749-3.124878.7714596-4.173896 1.9645092-.827266.9133584-1.336513 2.0996225-1.478122 3.3260725-.03697.453841-.03829.912911.01055 1.365947.160966 1.32086.767587 2.583013 1.712532 3.512441.896573.908166 2.09462 1.494199 3.351277 1.66413.502855.08044 1.014373.04408 1.51936.0068 1.417655-.176415 2.754531-.90395 3.692007-1.990866.866418-.987889 1.37694-2.281541 1.443388-3.597945.02841-.675807-.03829-1.357955-.234374-2.006169-.295603-1.0125002-.864397-1.9409274-1.634406-2.6551461-.920787-.8868739-2.146044-1.4380975-3.409875-1.5654751-.265542-.0213155-.532444-.029664-.798746-.0260522zm.410225.7476543c.768617.027829 1.515013.2231018 2.190048.5810208L18.01 11.170907zm-.414584.00444v4.4069914l-2.179201-3.8151404c.517312-.2756207 1.076164-.4707045 1.647422-.5525203.172917-.025756.353126-.031499.531779-.039582zm2.96275.7893113c.06773.043637.140402.077801.206165.1249915.557388.3979802 1.03728.9041364 1.40215 1.4865339l-3.796225 2.2144597zm-5.502254.013322l2.179195 3.8128111-3.761501-2.1925316c.234082-.3753918.497823-.7308596.820455-1.0326835.232031-.2227465.491293-.41373.761851-.587596zm7.314634 1.9645092c.02666.052016.05985.1004491.08466.1534713.315655.6403756.478238 1.3463256.50573 2.0587886h-4.373585a.83199264.84062774 0 0 0-.0023-.0044zm-9.100967.019835l3.750645 2.1881499a.83199264.84062774 0 0 0-.0022.0044h-4.334517c.02226-.767327.23455-1.513673.586039-2.1925317zm-.581701 2.6134999h4.295452a.83199264.84062774 0 0 0 .0044.0222l-3.735445 2.17938c-.350997-.677977-.537803-1.433429-.564334-2.201292zm5.934191 0h4.338855c-.03026.750576-.210677 1.495999-.55348 2.164028-.0088.01806-.02109.03464-.03026.05264l-3.759336-2.19473a.83199264.84062774 0 0 0 .0044-.0222zm-1.452075.401222a.83199264.84062774 0 0 0 .02636.03061l-2.144468 3.751423c-.527025-.339487-.994761-.774056-1.365252-1.28044-.08041-.108384-.141193-.229911-.212727-.344212zm1.26541 0l3.73328 2.179375c-.408528.650562-.963578 1.205253-1.60835 1.615898l-2.153125-3.766713a.83199264.84062774 0 0 0 .02812-.02842zm-.37983.252174l2.144468 3.751422c-.340486.180027-.699222.323965-1.072232.420974-.367767.103587-.740327.144383-1.117813.14912v-4.306137a.83199264.84062774 0 0 0 .04555-.01539zm-.507897.0022a.83199264.84062774 0 0 0 .04775.01332v4.30833c-.271694-.0044-.543339-.02694-.809602-.08547-.47701-.09462-.931927-.282963-1.365255-.515248z"}
              transform={"matrix(1.07958 0 0 1.08033 -.114 -.114)"}/>
          </g>
        </g>
        break
      case diplomacy.standardRule.MilitaryBranch.Fleet:
        unitSvg = <g
          stroke={"#000"}
          transform={`translate(${position.x - 15}, ${position.y - 10})`}
          onClick={() => { if (this.props.on) { this.props.on(EventTarget.click) } }}
          onDoubleClick={() => { if (this.props.on) { this.props.on(EventTarget.dblclick) } }}
          onMouseDown={() => { if (this.props.on) { this.props.on(EventTarget.mousedown) } }}
          onMouseUp={() => { if (this.props.on) { this.props.on(EventTarget.mouseup) } }}
          key="unitSvg"
        >
          <rect
            ry={".82358736"} y={".51219875"} x={".51344293"} height={"20"} width={"30"}
            fill={color} strokeLinecap="round"/>
          <g strokeWidth=".60250032" fill="#666" fillRule="evenodd">
            <path
              d={"M22.2 17.1v-1.5h1l1 .3h1.5v.25h-1.5l-.2.35.2.3v.3z"}
              transform={"matrix(.83088 0 0 .82887 2.548 2.632)"}/>
            <path
              d={"M8.5 17.1v-1.5h-1l-1 .3H5v.25h1.5l.2.35-.2.3v.3zM11.6 16.5v-3l-.5-.5h.5V7.3l-.5-.3h.5V0h.2v7h.5l-.5.3V13h.5l-.5.5v3z"}
              transform={"matrix(.83088 0 0 .82887 2.548 2.632)"}/>
            <path
              d={"M20.1 16.5v-3l-.5-.5h.5V7.3l-.5-.3h.5V0h.2v7h.5l-.5.3V13h.5l-.5.5v3zM13 16.5V11l.2-.5h1.1l.2.5v5.5M17 16.5V11l.2-.5h1.1l.2.5v5.5"}
              transform={"matrix(.83088 0 0 .82887 2.548 2.632)"}/>
            <path
              d={"M9.3 17.1v-2h.2v-2h1.3v1l-.3.5v.5h1v1h8.8v-1h.5v-1h.5v1h.5v2"}
              transform={"matrix(.83088 0 0 .82887 2.548 2.632)"}/>
            <path
              d={"M0 19.5L.25 17H29.5l.5 1.5v1z"}
              transform={"matrix(.83088 0 0 .82887 2.548 2.632)"}/>
          </g>
        </g>
        break
    }

    if (this.props.unit.status) {
      const dest = this.provincePositionOf(this.props.unit.status.attackedFrom)

      return <g>
        <Svg.Line
          from={position}
          dest={dest}
          stroke={this.colors.fill}
          strokeWidth={this.size.strokeWidth}/>
        <Svg.Circle
          center={position}
          r={this.size.unitRadius}
          stroke={this.colors.border}
          strokeWidth={this.size.strokeWidth}
          fill={this.colors.dislodged}
          />
        {[unitSvg]}
      </g>
    } else {
      return unitSvg
    }
  }
  protected abstract locationPositionOf (
    location: diplomacy.standardRule.Location<Power>, isDislodged: boolean
  ): Svg.Point
  protected abstract provincePositionOf (
    province: diplomacy.board.Province<Power>
  ): Svg.Point
  protected abstract colors: Colors<Power>
  protected abstract size: Size
}
