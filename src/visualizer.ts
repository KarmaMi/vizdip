import * as diplomacy from "js-diplomacy"

export enum EventTarget {
  click,
  dblclick,
  mousedown,
  mouseup,
  mousemove
}
export declare type Listener = (target: Document, event: Event) => void

const events =
  Object.keys(EventTarget)
    .map((k: any): EventTarget | string => EventTarget[k])
    .filter((v: any) => typeof v !== "number") as EventTarget[]

export abstract class Visualizer<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus> {
  static provinceClassName = "vizdip-province"
  static unitClassName = "viszip-unit"

  private unitListeners: Map<EventTarget, Set<Listener>>
  private provinceListeners: Map<EventTarget, Set<Listener>>

  constructor (public mapSvg: Document) {
    events.forEach((event: EventTarget) => {
      this.mapSvg.addEventListener(EventTarget[event], (e: Event) => {
        const target = this.getTargetElement(<Element>e.target)
        if (!target) return

        if (target.classList.contains(Visualizer.unitClassName)) {
          (this.unitListeners.get(event) || new Set()).forEach(listener => listener(target, e))
        } else if (target.classList.contains(Visualizer.provinceClassName)) {
          (this.provinceListeners.get(event) || new Set()).forEach(listener => listener(target, e))
        }
      })
    })
  }

  private getTargetElement (elem: Element | null): Element | null {
    while (elem) {
      if (!elem.classList) return null
      if (
        elem.classList.contains(Visualizer.provinceClassName) ||
        elem.classList.contains(Visualizer.unitClassName)
      ) {
        return elem
      }
      elem = <Element>elem.parentNode
    }
    return null
  }

  protected abstract visualizeBoard (
    board: diplomacy.board.Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>
  ): void
  protected abstract visualizeOrders (
    orders: Set<diplomacy.rule.Order<Power, MilitaryBranch>>
  ): void

  onUnit (event: EventTarget, listener: Listener) {
    if (!this.unitListeners.has(event)) {
      this.unitListeners.set(event, new Set())
    }

    const listeners = this.unitListeners.get(event)
    if (listeners) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    }
  }
  onProvince (event: EventTarget, listener: Listener) {
    if (!this.provinceListeners.has(event)) {
      this.provinceListeners.set(event, new Set())
    }

    const listeners = this.provinceListeners.get(event)
    if (listeners) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    }
  }
}
