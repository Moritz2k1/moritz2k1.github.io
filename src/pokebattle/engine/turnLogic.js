import { movepool } from "../data/movepool.js";
import { calcDamage } from "../utils/calcDamage.js";
import { calcAllStats } from "../utils/calcStats.js";
import { getTypeEffectiveness } from "../utils/getters.js";

// Check if pokemon is defeated
function isDefeated(pokemon) {
  return pokemon.currentHp <= 0;
}

export function executeMove(attacker, defender, move) {
  // Get damage of move
  const result = calcDamage(attacker, defender, move);

  // Check if move missed
  if (result.missed) {
    console.log(`${attacker.name} used ${move.name} but it missed!`);
    return;
  }

  // Track HP for drain moves
  const hpBefore = defender.currentHp;
  defender.currentHp = Math.max(0, defender.currentHp - result.finalDamage);
  const actualDamage = hpBefore - defender.currentHp;

  console.log(
    `${attacker.name} used ${move.name} and dealt ${actualDamage} damage${result.crit ? " (Critical Hit!)" : ""}!`,
  );

  // Print if effective or not
  const effectiveness = getTypeEffectiveness(move.type, defender.type);
  if (effectiveness === 0) {
    console.log("It had no effect!");
  } else if (effectiveness < 1) {
    console.log("It's not very effective...");
  } else if (effectiveness >= 2) {
    console.log("It's super effective!");
  }

  // Drain heals based on damage dealt
  if (move.drain) {
    const maxHp = calcAllStats(attacker).hp;
    const healAmount = Math.floor(actualDamage * move.drain);
    attacker.currentHp = Math.min(attacker.currentHp + healAmount, maxHp);
    console.log(`${attacker.name} restored ${healAmount} HP!`);
  }
}
