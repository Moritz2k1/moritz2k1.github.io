import { typeChart } from "../data/typeChart.js";
import { calcAllStats } from "./calcStats.js";

export function getTypeEffectiveness(moveType, defenderTypes) {
  let mult = 1;

  for (const defType of defenderTypes) {
    mult *= typeChart[moveType]?.[defType] ?? 1;
  }

  return mult;
}

export function getSpeed(pokemon) {
  return calcAllStats(pokemon).speed;
}

export function getMaxHp(pokemon) {
  return calcAllStats(pokemon).hp;
}
