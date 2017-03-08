import * as React from "react"

export interface Point {
  x: number
  y: number
}

export interface ArrowHeadProps {
  src: Point
  dest: Point
  headLength: number
  strokeWidth: number
  fillColor: string
  strokeColor: string
}
export class ArrowHead extends React.Component<ArrowHeadProps, {}> {
  render () {
    const theta =
      Math.atan2(this.props.dest.x - this.props.src.x, this.props.dest.y - this.props.src.y) * 180 / Math.PI
    const l =
      Math.sqrt(
        (this.props.dest.x - this.props.src.x) * (this.props.dest.x - this.props.src.x) +
        (this.props.dest.y - this.props.src.y) * (this.props.dest.y - this.props.src.y)
      )
    const destX = this.props.headLength * Math.tan(30 / 180 * Math.PI)
    return <polygon
      points={`-${destX},${l-this.props.headLength} 0,${l} ${destX},${l-this.props.headLength}`}
      fill={this.props.fillColor}
      stroke={this.props.strokeColor}
      strokeWidth={this.props.strokeWidth}
      transform={`translate(${this.props.src.x}, ${this.props.src.y}), rotate(${-theta})`}
      />
  }
}

export interface CircleProps {
  center: Point
  r: number
  strokeWidth: number
  stroke: string
  fill: string
}
export class Circle extends React.Component<CircleProps, {}> {
  render () {
    return <circle
      cx={this.props.center.x}
      cy={this.props.center.y}
      r={this.props.r}
      strokeWidth={this.props.strokeWidth}
      fill={this.props.fill}
      stroke={this.props.stroke} />
  }
}

export interface LineProps {
  from: Point
  dest:  Point
  ctrl?: Point
  strokeWidth: number
  stroke: string,
  strokeDasharray?: string
}
export class Line extends React.Component<LineProps, {}> {
  render () {
    if (this.props.ctrl) {
      return <path
        d={`M ${this.props.from.x}, ${this.props.from.y} Q ${this.props.ctrl.x} ${this.props.ctrl.y} ${this.props.dest.x}, ${this.props.dest.y}`}
        stroke={this.props.stroke}
        strokeWidth={this.props.strokeWidth}
        fill={"none"}
        strokeDasharray={this.props.strokeDasharray}
        />
    } else {
      return <path
        d={`M ${this.props.from.x}, ${this.props.from.y} ${this.props.dest.x}, ${this.props.dest.y}`}
        stroke={this.props.stroke}
        strokeWidth={this.props.strokeWidth}
        fill={"none"}
        strokeDasharray={this.props.strokeDasharray}
        />
    }
  }
}
