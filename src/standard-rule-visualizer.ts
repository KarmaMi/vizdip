import { Visualizer } from "./visualizer"
import * as diplomacy from "js-diplomacy"

export declare type Province<Power> = diplomacy.board.Province<Power>
export declare type Location<Power> = diplomacy.standardRule.Location<Power>
export declare type MilitaryBranch = diplomacy.standardRule.MilitaryBranch
export declare type State = diplomacy.standardRule.State
export declare type Dislodged<Power> = diplomacy.standardRule.Dislodged<Power>
export declare type ProvinceStatus<Power> = diplomacy.standardRule.ProvinceStatus<Power>

interface Matrix {
  a: number
  b: number
  c: number
  d: number
  e: number
  f: number
}

declare type Point = [number, number]

interface SvgValue {
  baseVal: { value: number }
}

interface SvgElement extends HTMLElement {
  getBBox(): { width: number, height: number }
  transform: { baseVal: Array<{ matrix: Matrix }> }
}

interface SvgElementWithCenter {
  cx: SvgValue
  cy: SvgValue
}

function hasCenter(element: any): element is SvgElementWithCenter {
  return "cx" in element && "cy" in element
}

function apply (matrix: Matrix, v: [number, number]) {
  return [
    matrix.a * v[0] + matrix.c * v[1] + matrix.e,
    matrix.b * v[0] + matrix.d * v[1] + matrix.f
  ]
}

function removeAllChild (elem: Element) {
  while (elem.firstChild) elem.removeChild(elem.firstChild)
}

const defaultNeutralProvinceBackground = "rgb(129, 199, 132)"
const defaultDislodgedColor = "red"
const defaultBorderColor = "white"
const defaultFillColor = "black"
const defaultMarginColor = "white"
const defaultOrderStrokeWidth = 2
const defaultOrderMarginStrokeWidth = 0.5
const defaultStandoffRadius = 10
const defaultStandoffWidth = 3
const defaultStandoffMarginWidth = 0.5

export interface Svgs {
  map: Document
  army: HTMLElement
  fleet: HTMLElement
}

export interface Colors<Power> {
  power: (power: Power) => string
  neutralProvince: string | null
  fill: string | null
  margin: string | null
  border: string | null
  dislodged: string | null
}

export interface Stringify<Power> {
  fromState: (state: State) => string
  fromProvince: (province: Province<Power>) => string | null
  fromLocation: (location: Location<Power>) => string | null
}

export interface Configs {
  orderStrokeWidth: number | null
  orderMarginStrokeWidth: number | null
  standoffRadius: number | null
  standoffWidth: number | null
  standoffMarginWidth: number | null
  orderArrowHeadLength: number | null
}

export class StandardRuleVisualizer<Power>
  extends Visualizer<Power, MilitaryBranch, State, Dislodged<Power>, ProvinceStatus<Power>> {

  constructor (
    private svgs: Svgs, map: diplomacy.standardRule.DiplomacyMap<Power>,
    private colors: Colors<Power>, private stringify: Stringify<Power>, private configs: Configs
  ) {
    super(svgs.map)
    // Initialize provinces
    map.provinces.forEach(province => {
      // Toggle supply center
      const supplyCenterSvg =
        this.mapSvg.getElementById(`${province.name.toString()}/supply_center`)

      if (supplyCenterSvg) {
        if (province.isSupplyCenter) {
          supplyCenterSvg.style.display = "inline"
        } else {
          supplyCenterSvg.style.display = "none"
        }
      }

      const nameSvg = this.mapSvg.getElementById(`${province.name}/name`)
      const name = this.stringify.fromProvince(province)
      if (nameSvg && name) {
        nameSvg.innerHTML = name
      }
    })

    // Initialize locations
    map.locations.forEach(location => {
      const nameSvg = this.mapSvg.getElementById(`${location.province.name}/${location}/name`)
      const name = this.stringify.fromLocation(location)
      if (nameSvg && name) {
        nameSvg.innerHTML = name
      }
    })
  }
  visualizeBoard (board: diplomacy.standardRule.Board<Power>) {
    this.clearBoard()

    // Visualize state
    const stateText = this.mapSvg.getElementById("state/text")
    if (stateText) {
      stateText.innerHTML = this.stringify.fromState(board.state)
    }

    // Visualize provinces
    board.map.provinces.forEach(p => {
      const status = board.provinceStatuses.get(p) || null
      this.visualizeProvince(p, status)
    })
    // Visualize units
    board.units.forEach(u => {
      const status = board.unitStatuses.get(u) || null
      this.visualizeUnit(u, status)
    })
  }
  visualizeOrders (
    orders: Set<diplomacy.standardRule.Order.Order<Power>>
  ) {
    this.clearOrder()
    orders.forEach(order => this.visualizeOrder(order))
  }

  private createUnitSvg (tpe: diplomacy.standardRule.MilitaryBranch, power: Power): SvgElement {
    const unitSvg =
      <HTMLElement>((tpe === diplomacy.standardRule.MilitaryBranch.Army)
        ? this.svgs.army
        : this.svgs.fleet
      ).cloneNode(true)
    unitSvg.setAttribute("class", Visualizer.unitClassName)
    const color = this.colors.power(power)
    function fillColor (dom: HTMLElement) {
      Array.from(dom.children).forEach((child: HTMLElement) => fillColor(child))
      if (!dom.classList.contains("vizdip-fix-color")) {
        dom.style.fill = color
      }
    }
    fillColor(unitSvg)

    return <SvgElement>unitSvg
  }

  private getCenterPosition (
    target: diplomacy.board.Province<Power> | diplomacy.standardRule.Location<Power>,
    idDislodged: boolean
  ): Point {
    let positionElem = null
    if (target instanceof diplomacy.board.Province) {
      // The target is an instance of Province
      positionElem = this.mapSvg.getElementById(`${target.name}/position`)
    } else {
      // The target is an instance of Location
      if (idDislodged) {
        positionElem =
          this.mapSvg.getElementById(`${target.province.name}/${target}/dislodged_position`)
      } else {
        positionElem = this.mapSvg.getElementById(`${target.province.name}/${target}/position`)
      }
    }
    if (hasCenter(positionElem)) {
      return [positionElem.cx.baseVal.value, positionElem.cy.baseVal.value]
    } else {
      throw "Internal error"
    }
  }

  private createLine (src: Point, dest: Point, ctrl: Point | null, color: string, width: number) {
    const line = this.mapSvg.createElementNS("http://www.w3.org/2000/svg", "path")
    if (ctrl) {
      line.setAttribute(
        "d", `M ${src[0]}, ${src[1]} Q ${ctrl[0]}, ${ctrl[1]} ${dest[0]}, ${dest[1]}`
      )
    } else {
      line.setAttribute(
        "d", `M ${src[0]}, ${src[1]} ${dest[0]}, ${dest[1]}`
      )
    }
    line.setAttribute("stroke", color)
    line.setAttribute("stroke-width", width + "")
    line.setAttribute("fill", "none")
    return line
  }

  private createCircle (
    center: Point, r: number, strokeWidth: number, fillColor: string, strokeColor: string
  ) {
    const circle = this.mapSvg.createElementNS("http://www.w3.org/2000/svg", "circle")
    circle.setAttribute("cx", center[0] + "")
    circle.setAttribute("cy", center[1] + "")
    circle.setAttribute("r", r + "")
    circle.setAttribute("stroke", strokeColor)
    circle.setAttribute("stroke-width", strokeWidth + "")
    circle.setAttribute("fill", fillColor)
    return circle
  }

  private createArrowHead (
    src: Point, dest: Point, headLength: number, strokeWidth: number, fillColor: string, strokeColor: string
  ) {
    const theta = Math.atan2(dest[0] - src[0], dest[1] - src[1]) * 180 / Math.PI
    const marker = this.mapSvg.createElementNS("http://www.w3.org/2000/svg", "polygon")
    const l =
      Math.sqrt((dest[0] - src[0]) * (dest[0] - src[0]) + (dest[1] - src[1]) * (dest[1] - src[1]))
    const destX = headLength * Math.tan(30 / 180 * Math.PI)
    marker.setAttribute(
      "points",
      `-${destX},${l - headLength} 0,${l}, ${destX},${l - headLength}`
    )
    marker.setAttribute("fill", fillColor)
    marker.setAttribute("stroke", strokeColor)
    marker.setAttribute("stroke-width", strokeWidth + "")
    marker.setAttribute("transform", `translate(${src[0]}, ${src[1]}), rotate(${-theta})`)

    return marker
  }

  private visualizeProvince (
    province: diplomacy.board.Province<Power>,
    status: diplomacy.standardRule.ProvinceStatus<Power> | null
  ) {
    const backgroundSvg = <HTMLElement>(this.mapSvg.getElementById(`${province.name}/background`))
    if (backgroundSvg.classList.contains("vizdip-fix-color")) {
      return
    }

    const color = (status && status.occupied !== null)
      ? this.colors.power(status.occupied)
      : (this.colors.neutralProvince || defaultNeutralProvinceBackground)
    backgroundSvg.style.fill = color
    backgroundSvg.style.stroke = color

    if (status && status.standoff) {
      const standoffBorderColor = this.colors.border || defaultBorderColor
      const standoffColor = this.colors.fill || defaultFillColor
      const standoffWidth = this.configs.standoffWidth || defaultStandoffWidth
      const standoffMarginWidth = this.configs.standoffMarginWidth || defaultStandoffMarginWidth
      const standoffRadius = this.configs.standoffRadius || defaultStandoffRadius

      const [cx, cy] = this.getCenterPosition(province, false)
      const standoff = this.mapSvg.createElementNS("http://www.w3.org/2000/svg", "polygon")
      const s = standoffWidth / 2
      const r = standoffRadius
      standoff.setAttribute(
        "points",
        `${s},${r} ${s},${s} ${r},${s} ${r},${-s} ${s},${-s} ${s},${-r} ` +
        `${-s},${-r} ${-s},${-s} ${-r},${-s} ${-r},${s} ${-s},${s} ${-s},${r}`
      )

      standoff.setAttribute("stroke", standoffBorderColor)
      standoff.setAttribute("stroke-width", standoffMarginWidth + "")
      standoff.setAttribute("fill", standoffColor)
      standoff.setAttribute("transform", `translate(${cx},${cy}), rotate(45)`)
      const statusElem = this.mapSvg.getElementById("status")
      if (statusElem) {
        statusElem.appendChild(standoff)
      }
    }
  }

  visualizeUnit (
    unit: diplomacy.standardRule.Unit<Power>, status: diplomacy.standardRule.Dislodged<Power> | null
  ) {
    const location = unit.location
    const tpe = unit.militaryBranch

    // Prepare an element for unit
    const unitSvg = this.createUnitSvg(tpe, unit.power)

    // Get position
    const [cx, cy] = this.getCenterPosition(location, status !== null)

    unitSvg.setAttribute("id", `${unit.power}/${unit}`)
    if (status) {
      // dislodged
      const x = this.mapSvg.getElementById("dislodged_unit")
      if (x) {
        x.appendChild(unitSvg)
      }
    } else {
      // otherwise
      const x = this.mapSvg.getElementById("unit")
      if (x) {
        x.appendChild(unitSvg)
      }
    }

    const bbox = unitSvg.getBBox()
    unitSvg.setAttribute("transform", `translate(${cx - bbox.width / 2}, ${cy - bbox.height / 2})`)
    if (status) {
      const r = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height) / 2

      const dislodgedBorderColor = this.colors.dislodged || defaultDislodgedColor
      const dislodgedColor = this.colors.dislodged || defaultDislodgedColor
      const orderColor = this.colors.fill || defaultFillColor
      const orderStrokeWidth = this.configs.orderStrokeWidth || defaultOrderStrokeWidth

      const [cx2, cy2] = this.getCenterPosition(status.attackedFrom, false)
      const line = this.createLine([cx, cy], [cx2, cy2], null, orderColor, orderStrokeWidth)

      const circle =
        this.createCircle([cx, cy], r, orderStrokeWidth, dislodgedColor, dislodgedBorderColor)
      const statusElem = this.mapSvg.getElementById("status")
      if (statusElem) {
        statusElem.appendChild(line)
        statusElem.appendChild(circle)
      }
    }
  }

  private clearBoard () {
    const status = this.mapSvg.getElementById("status")
    if (status) {
      removeAllChild(status)
    }
    const unit = this.mapSvg.getElementById("unit")
    if (unit) {
      removeAllChild(unit)
    }
    const dislodgedUnit = this.mapSvg.getElementById("dislodged_unit")
    if (dislodgedUnit) {
      removeAllChild(dislodgedUnit)
    }
  }

  private visualizeOrder (order: diplomacy.standardRule.Order.Order<Power>) {
    const OrderType = diplomacy.standardRule.Order.OrderType
    const orderSvg = this.mapSvg.getElementById("order")

    if (!orderSvg) {
      return
    }

    if (order.tpe === OrderType.Build) {
      const unitSvg = this.createUnitSvg(order.unit.militaryBranch, order.unit.power)

      orderSvg.appendChild(unitSvg)

      const [cx, cy] = this.getCenterPosition(order.unit.location, false)
      const bbox = unitSvg.getBBox()
      const x = cx - bbox.width / 2
      const y = cy - bbox.height / 2

      unitSvg.setAttribute("opacity", "0.5")
      unitSvg.setAttribute("transform", `translate(${x}, ${y})`)
    } else {
      const unitId = `${order.unit.power}/${order.unit}`
      const unitSvg = <SvgElement>(this.mapSvg.getElementById(unitId))
      if (!unitSvg) return

      const createArrowHead = (src: Point, dest: Point) => {
        return this.createArrowHead(
          src, dest, orderArrowHeadLength, orderMarginStrokeWidth, orderColor, orderMarginColor
        )
      }

      const bbox = unitSvg.getBBox()
      const r = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height) / 2
      const [x1, y1] = apply(unitSvg.transform.baseVal[0].matrix, [0, 0])
      const cx1 = x1 + bbox.width / 2
      const cy1 = y1 + bbox.height / 2

      const orderColor = this.colors.fill || defaultFillColor
      const orderArrowHeadLength = this.configs.orderArrowHeadLength || r / 2
      const orderMarginColor = this.colors.margin || defaultMarginColor
      const orderStrokeWidth = this.configs.orderStrokeWidth || defaultOrderStrokeWidth
      const orderMarginStrokeWidth = this.configs.orderMarginStrokeWidth || defaultOrderMarginStrokeWidth
      const destPosition =
        (x: number, y: number, theta: number, l: number) => [x + l * Math.cos(theta), y + l * Math.sin(theta)]

      if (order instanceof diplomacy.standardRule.Order.Hold) {
        const circle =
          this.createCircle([cx1, cy1], r, orderStrokeWidth, "none", orderColor)
        orderSvg.appendChild(circle)
      } else if (
        (order instanceof diplomacy.standardRule.Order.Move) ||
        (order instanceof diplomacy.standardRule.Order.Retreat)
      ) {
        const o: diplomacy.standardRule.Order.Move<Power>= order
        const [cx2, cy2] = this.getCenterPosition(o.destination, false)
        const theta = Math.atan2(cy2 - cy1, cx2 - cx1)
        const [dx, dy] =
          destPosition(cx2, cy2, theta, -orderArrowHeadLength + orderMarginStrokeWidth * 2)

        const line1 = this.createLine([cx1, cy1], [dx, dy], null, orderColor, orderStrokeWidth)
        const line2 =
          this.createLine(
            [cx1, cy1], [dx, dy], null,
            orderMarginColor, orderStrokeWidth + orderMarginStrokeWidth * 2
          )
        const marker = createArrowHead([cx1, cy1], [cx2, cy2])
        orderSvg.appendChild(marker)
        orderSvg.appendChild(line2)
        orderSvg.appendChild(line1)
      } else if (order instanceof diplomacy.standardRule.Order.Support) {
        const o: diplomacy.standardRule.Order.Support<Power> =  order
        if (o.target instanceof diplomacy.standardRule.Order.Move) {
          const [cx2, cy2] = this.getCenterPosition(o.destination, false)
          const [cx3, cy3] = this.getCenterPosition(o.target.unit.location, false)
          const theta = Math.atan2(cy2 - cy3, cx2 - cx3)
          const [dx, dy] =
            destPosition(cx2, cy2, theta, -orderArrowHeadLength + orderMarginStrokeWidth * 2)

          const line =
            this.createLine([cx1, cy1], [dx, dy], [cx3, cy3], orderColor, orderStrokeWidth)
          line.setAttribute("stroke-dasharray", "2, 2")
          const marker = createArrowHead([cx3, cy3], [cx2, cy2])
          orderSvg.appendChild(marker)
          orderSvg.appendChild(line)
        } else if (o.target instanceof diplomacy.standardRule.Order.Hold) {
          const [cx2, cy2] = this.getCenterPosition(o.destination, false)
          const theta = Math.atan2(cy2 - cy1, cx2 - cx1)
          const [dx, dy] =
            destPosition(cx2, cy2, theta, -orderArrowHeadLength + orderMarginStrokeWidth * 2)

          const line =
            this.createLine([cx1, cy1], [dx, dy], [cx1, cy1], orderColor, orderStrokeWidth)
          line.setAttribute("stroke-dasharray", "2, 2")
          const marker = createArrowHead([cx1, cy1], [cx2, cy2])
          orderSvg.appendChild(marker)
          orderSvg.appendChild(line)
        }
      } else if (order instanceof diplomacy.standardRule.Order.Convoy) {
        const o: diplomacy.standardRule.Order.Convoy<Power> = order
        const [cx2, cy2] = this.getCenterPosition(o.target.destination, false)
        const [cx3, cy3] = this.getCenterPosition(o.target.unit.location, false)
        const theta = Math.atan2(cy2 - cy3, cx2 - cx3)
        const [dx, dy] =
          destPosition(cx2, cy2, theta, -orderArrowHeadLength + orderMarginStrokeWidth * 2)

        const line =
          this.createLine([cx3, cy3], [dx, dy], [cx1, cy1], orderColor, orderStrokeWidth)
        line.setAttribute("stroke-dasharray", "5, 2")
        const marker = createArrowHead([cx1, cy1], [cx2, cy2])
        orderSvg.appendChild(marker)
        orderSvg.appendChild(line)
      } else if (order instanceof diplomacy.standardRule.Order.Disband) {
        const [x2, y2] = [cx1 - r * Math.cos(Math.PI / 4), cy1 - r * Math.sin(Math.PI / 4)]
        const [x3, y3] = [cx1 + r * Math.cos(Math.PI / 4), cy1 + r * Math.sin(Math.PI / 4)]
        const line = this.createLine([x2, y2], [x3, y3], null, orderColor, orderStrokeWidth)
        orderSvg.appendChild(line)
      }
    }
  }
  private clearOrder () {
    const x = this.mapSvg.getElementById("order")
    if (x) {
      removeAllChild(x)
    }
  }
}
