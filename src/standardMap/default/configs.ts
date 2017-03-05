import * as diplomacy from "js-diplomacy"

export declare type Power = diplomacy.standardMap.Power
const { England, Russia, France, Germany, Italy, Austria, Turkey } = diplomacy.standardMap.Power

function powers(power: Power) {
  switch (power) {
    case England:
      return 'rgb(239, 154, 154)'
    case Russia:
      return 'rgb(206, 147, 216)'
    case France:
      return 'rgb(144, 202, 249)'
    case Germany:
      return 'rgb(150, 150, 150)'
    case Italy:
      return 'rgb(159, 168, 218)'
    case Austria:
      return 'rgb(255, 224, 130)'
    case Turkey:
      return 'rgb(255, 171, 145)'
  }
}

export class Colors {
  power (power: Power) { return powers(power) }
  neutralProvince: "rgb(129, 199, 132)"
  fill: "black"
  border: "white"
  dislodged: "red"
}

export const colors = new Colors()

export const size = {
  unitRadius: Math.sqrt(30*30 + 20*20) / 2,
  strokeWidth: 2,
  standoffRadius: 10,
  standoffWidth: 3,
  standoffMarginWidth: 0.5
}
