import * as React from "react"
import * as ReactDOM from "react-dom"
import * as diplomacy from "js-diplomacy"

import { EventTarget } from "../../event-target"
import { Point } from "../../util"
import { MapImage } from "./map-image"
import { provincePositionOf } from "./position"
import { size, colors } from "./configs"

export interface Colors<Power> {
  power (power: Power): string
  neutralProvince: string
  fill: string
  border: string
}

export interface Size {
  standoffRadius: number
  standoffWidth: number
  standoffMarginWidth: number
}

export interface ProvinceWithStatus {
  province: diplomacy.board.Province<diplomacy.standardMap.Power>
  status: diplomacy.standardRule.ProvinceStatus<diplomacy.standardMap.Power> | null
}

export interface Props {
  map: diplomacy.standardRule.DiplomacyMap<diplomacy.standardMap.Power>
  provinces: Set<ProvinceWithStatus>
  on?: (event: EventTarget, province: diplomacy.board.Province<diplomacy.standardMap.Power>) => void
}

export abstract class MapComponent extends React.Component<Props, {}> {
  render () {
    // Render standoff markers
    const standoffs = Array.from(this.props.provinces).map(elem => {
      if (elem.status && elem.status.standoff) {
        const { x, y } = this.positionOf(elem.province)
        const s = this.size.standoffWidth / 2
        const r = this.size.standoffRadius

        return <polygon
          points={
            `${s},${r} ${s},${s} ${r},${s} ${r},${-s} ${s},${-s} ${s},${-r} ` +
            `${-s},${-r} ${-s},${-s} ${-r},${-s} ${-r},${s} ${-s},${s} ${-s},${r}`
          }
          stroke={this.colors.border || undefined}
          strokeWidth={this.size.standoffMarginWidth || undefined}
          fill={this.colors.fill || undefined}
          transform={`translate(${x}, ${y}, rotate(45))`}
        />
      } else {
        return null
      }
    }).filter(x => x !== null)

    return <g>
      <MapImage />
      {standoffs}
    </g>
  }

  componentDidMount () {
    this.update()
  }
  componentDidUpdate () {
    this.update()
  }
  private update () {
    const map = ReactDOM.findDOMNode(this)
    /* Render province informations */
    // Supply centers
    this.props.map.provinces.forEach(province => {
      const tgt = map.querySelector(`.supply_center.${province.name}`)
      if (!tgt) throw province.toString()
      if (province.isSupplyCenter) {
        (tgt as HTMLElement).style.display = ""
      } else {
        (tgt as HTMLElement).style.display = "none"
      }
    })

    // name
    this.props.map.locations.forEach(location => {
      const name = this.locationNameOf(location)
      if (name) {
        const tgt = map.querySelector(`.locaton_name.${location.name}`)
        if (tgt) {
          (tgt as HTMLElement).innerHTML = name
        }
      }
    })
    this.props.map.provinces.forEach(province => {
      const name = this.provinceNameOf(province)
      if (name) {
        const tgt = map.querySelector(`.name.${province.name}`) as HTMLElement
        if (tgt) {
          (tgt as HTMLElement).innerHTML = name
        }
      }
    })

    // occupied
    this.props.provinces.forEach(elem => {
      const province = elem.province
      const color =
        (elem.status && elem.status.occupied)
          ? this.colors.power(elem.status.occupied)
          : this.colors.neutralProvince
      const tgt = map.querySelector(`.${province.name}`)
      if (tgt && !((tgt as HTMLElement).classList.contains("fix-color"))) {
        (tgt as HTMLElement).style.fill = color;
        (tgt as HTMLElement).style.stroke = color
      }
    })

    // Add eventlistener
    this.props.map.provinces.forEach(province => {
      Array.from(map.querySelectorAll(`.${province.name}`)).forEach(dom => {
        dom.addEventListener('click', () => {
          if (this.props.on) {
            this.props.on(EventTarget.click, province)
          }
        })
        dom.addEventListener('dblclick', () => {
          if (this.props.on) {
            this.props.on(EventTarget.dblclick, province)
          }
        })
        dom.addEventListener('mousedown', () => {
          if (this.props.on) {
            this.props.on(EventTarget.mousedown, province)
          }
        })
        dom.addEventListener('mouseup', () => {
          if (this.props.on) {
            this.props.on(EventTarget.mouseup, province)
          }
        })
      })
    })
  }

  protected abstract colors: Colors<diplomacy.standardMap.Power> = colors
  protected size: Size = size
  protected positionOf (
    province: diplomacy.board.Province<diplomacy.standardMap.Power>
  ): Point {
    return provincePositionOf(province)
  }
  protected provinceNameOf (
    province: diplomacy.board.Province<diplomacy.standardMap.Power>
  ): string | null {
    return null
  }
  protected locationNameOf (
    location: diplomacy.standardRule.Location<diplomacy.standardMap.Power>
  ): string | null {
    return null
  }
}
