import { getTypeEffectiveness } from "../utils/getters.js";
import { calcAllStats } from "../utils/calcStats.js";
import { movepool } from "../data/movepool.js";

// Get maxHP
function hpRatio(pokemon) {
    return pokemon.currentHp / pokemon.maxHp;
}

// Deterministic expected damage
function estimateDamage(attacker, defender, move) {
    if (move.power === 0) return 0;

    // Get attack and defense stats
    const atkStats = calcAllStats(attacker);
    const defStats = calcAllStats(defender);

    const atk = move.category === "Physical" ? atkStats.attack : atkStats.spAtk;
    const def =
        move.category === "Physical" ? defStats.defense : defStats.spDef;

    // Get STAB
    const stab = attacker.type.includes(move.type) ? 1.5 : 1;
    const effectiveness = getTypeEffectiveness(move.type, defender.type);

    // Get hit chance -> 0 means no misses
    const hitChance = move.accuracy === 0 ? 1 : move.accuracy / 100;

    const level = 50;
    const base = Math.floor(
        Math.floor((Math.floor((2 * level) / 5 + 2) * move.power * atk) / def) /
            50 +
            2,
    );

    // Use average random roll (0.925) instead of dice throw
    return base * 0.925 * stab * effectiveness * hitChance;
}

function pickMoveAi(moritzPokemon, challengerPokemon) {
    // Only consider moves with PP remaining, otherwise Struggle
    const available = moritzPokemon.moves.filter((m) => m.currentPp > 0);
    if (available.length === 0) return movepool.struggle;

    let best = available[0];
    let bestScore = -1;

    for (const move of available) {
        const score = estimateDamage(moritzPokemon, challengerPokemon, move);
        if (score > bestScore) {
            bestScore = score;
            best = move;
        }
    }

    return best;
}

// Score switch candidate
// Rewards offensive coverage / penalises defensive weakness
function scoreCandidate(candidate, challengerPokemon) {
    // Best type-effective, STAB-boosted move against the challenger
    let offScore = 0;
    for (const move of candidate.moves) {
        const eff = getTypeEffectiveness(move.type, challengerPokemon.type);
        const stab = candidate.type.includes(move.type) ? 1.5 : 1;
        if (eff * stab > offScore) offScore = eff * stab;
    }

    // Worst incoming effectiveness from the challenger's moves
    let defScore = 0;
    for (const move of challengerPokemon.moves) {
        const eff = getTypeEffectiveness(move.type, candidate.type);
        if (eff > defScore) defScore = eff;
    }

    // Scale by remaining HP
    return (offScore / (defScore + 0.5)) * hpRatio(candidate);
}

export function pickSwitchAi(moritzTeam, challengerPokemon) {
    let best = null;
    let bestScore = -1;

    for (const pokemon of moritzTeam) {
        if (pokemon.fainted || pokemon.isActive) continue;

        const score = scoreCandidate(pokemon, challengerPokemon);
        if (score > bestScore) {
            bestScore = score;
            best = pokemon;
        }
    }

    return best;
}

function isAtTypeDisadvantage(moritzPokemon, challengerPokemon) {
    // Worst incoming type multiplier from challenger's moves
    let worstIncoming = 0;
    for (const move of challengerPokemon.moves) {
        const eff = getTypeEffectiveness(move.type, moritzPokemon.type);
        if (eff > worstIncoming) worstIncoming = eff;
    }

    let bestOutgoing = 0;
    for (const move of moritzPokemon.moves) {
        const eff = getTypeEffectiveness(move.type, challengerPokemon.type);
        const stab = moritzPokemon.type.includes(move.type) ? 1.5 : 1;
        if (eff * stab > bestOutgoing) bestOutgoing = eff * stab;
    }

    return worstIncoming >= 2 && bestOutgoing <= 1;
}

// AI can only switch 3 times
export function getActionAi(moritzTeam, challengerPokemon, switchesLeft = 3) {
    const moritzPokemon = moritzTeam.find((p) => p.isActive);

    // Switch on type disadvantage
    if (
        switchesLeft > 0 &&
        isAtTypeDisadvantage(moritzPokemon, challengerPokemon)
    ) {
        const target = pickSwitchAi(moritzTeam, challengerPokemon);
        // Only switch if candidate is better matchup
        if (
            target &&
            scoreCandidate(target, challengerPokemon) >
                scoreCandidate(moritzPokemon, challengerPokemon)
        ) {
            return { type: "switch", pokemon: target };
        }
    }

    return { type: "move", move: pickMoveAi(moritzPokemon, challengerPokemon) };
}
