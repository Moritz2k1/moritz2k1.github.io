import { getTypeEffectiveness } from "./getters.js";
import { calcAllStats } from "./calcStats.js";

export function calcDamage(attacker, defender, move, level = 50) {
    // Check if attack misses
    if (move.accuracy !== 0) {
        const roll = Math.random() * 100;
        if (roll > move.accuracy) {
            return {
                damage: 0,
                missed: true,
                crit: false,
            };
        }
    }

    // Calculate stats of attacker and defender
    const attackerStats = calcAllStats(attacker);
    const defenderStats = calcAllStats(defender);

    // Check which stats to use if attack is physical
    const attack =
        move.category === "Physical"
            ? attackerStats.attack
            : attackerStats.spAtk;

    const defense =
        move.category === "Physical"
            ? defenderStats.defense
            : defenderStats.spDef;

    // Check if crit
    const crit = Math.random() < 1 / 24;
    const critMultiplier = crit ? 1.5 : 1;

    // Check if STAB
    const stab = attacker.type.includes(move.type) ? 1.5 : 1;

    // Check effectiveness
    const effectiveness = getTypeEffectiveness(move.type, defender.type);

    // Random factor
    const random = (Math.floor(Math.random() * 16) + 85) / 100;

    // Calculate damage
    const baseDamage = Math.floor(
        Math.floor(
            (Math.floor((2 * level) / 5 + 2) * move.power * attack) / defense,
        ) /
            50 +
            2,
    );

    const finalDamage = Math.floor(
        baseDamage * critMultiplier * stab * effectiveness * random,
    );

    return {
        finalDamage,
        missed: false,
        crit,
    };
}
