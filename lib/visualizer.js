'use strict'

const getTargetElement = Symbol('getTargetElement')
const unitListeners = Symbol('unitListeners')
const provinceListeners = Symbol('provinceListeners')

const events = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove']

module.exports = class Visualizer {
  constructor (mapSvg, visualizeBoard, visualizeOrders) {
    this.map = mapSvg
    this[getTargetElement] = (elem) => {
      while (elem) {
        if (!elem.classList) return null
        if (elem.classList.contains('vizdip-province') || elem.classList.contains('vizdip-unit')) {
          return elem
        }
        elem = elem.parentNode
      }
      return null
    }

    this[unitListeners] = new Map(events.map(e => [e, new Set()]))
    this[provinceListeners] = new Map(events.map(e => [e, new Set()]))

    events.forEach(event => {
      this.map.addEventListener(event, (e) => {
        const target = this[getTargetElement](e.target)
        if (!target) return

        if (target.classList.contains('vizdip-unit')) {
          this[unitListeners].get(event).forEach(listener => listener(target, e))
        } else if (target.classList.contains('vizdip-province')) {
          this[provinceListeners].get(event).forEach(listener => listener(target, e))
        }
      })
    })
  }

  visualizeBoard (board) {
  }
  visualizeOrders (orders) {
  }

  onUnit (event, listener) {
    console.assert(new Set([...events]).has(event))

    this[unitListeners].get(event).add(listener)
    return () => { this[unitListeners].get(event).delete(listener) }
  }
  onProvince (event, listener) {
    console.assert(new Set([...events]).has(event))

    this[provinceListeners].get(event).add(listener)
    return () => { this[provinceListeners].get(event).delete(listener) }
  }
}
