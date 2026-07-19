import { calcAllStats, calcHP } from "../utils/calcStats.js";

export function initPokemon(pokemon, isActive = false) {
    const maxHp = calcHP(pokemon.hp, pokemon.ivs.hp, pokemon.evs.hp, 50);
    return {
        ...pokemon,
        maxHp,
        currentHp: maxHp,
        isActive,
        fainted: false,
        moves: pokemon.moves.map((move) => ({ ...move, currentPp: move.pp })),
    };
}

export function initTeam(team, shuffle = true) {
    const ordered = shuffle
        ? [...team].sort(() => Math.random() - 0.5)
        : [...team];
    return ordered.map((p, i) => initPokemon(p, i === 0));
}
