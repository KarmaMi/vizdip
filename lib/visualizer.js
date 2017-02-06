'use strict'

const visualizeBoardS = Symbol('visualizeBoard')
const visualizeOrdersS = Symbol('visualizeOrders')

module.exports = class Visualizer {
  constructor (mapSvg, visualizeBoard, visualizeOrders) {
    this.map = mapSvg
    this[visualizeBoardS] = visualizeBoard
    this[visualizeOrdersS] = visualizeOrders
  }

  visualizeBoard (board) {
    this[visualizeBoardS](board, this.map)
  }
  visualizeOrders (orders) {
    this[visualizeOrdersS](orders, this.map)
  }

  addEventListenerForUnits (event, listener) {
    const units = this.map.querySelectorAll('.vizdip-unit')
    if (units) {
      [...units].forEach(u => u.addEventListener(event, listener))
      return () => [...units].forEach(u => u.removeEventListener(event, listener))
    } else {
      return () => {}
    }
  }
  addEventListenerForProvinces (event, listener) {
    const provinces = this.map.querySelectorAll('.vizdip-province')
    if (provinces) {
      [...provinces].forEach(p => p.addEventListener(event, listener))
      return () => [...provinces].forEach(p => p.removeEventListener(event, listener))
    } else {
      return () => {}
    }
  }
}
