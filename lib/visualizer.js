'use strict'

module.exports = class Visualizer {
  constructor (mapSvg, visualizeBoard, visualizeOrders) {
    this.map = mapSvg
  }

  visualizeBoard (board) {
  }
  visualizeOrders (orders) {
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
