// Helper function
export function calcHP(base, iv, ev, level) {
    return (
        Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) +
        level +
        10
    );
}

// Helper function
export function calcStat(base, iv, ev, level) {
    return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5;
}

// Calculates all stats of a pokemon
export function calcAllStats(pokemon, level = 50) {
    const ivs = pokemon.ivs;
    const evs = pokemon.evs;

    return {
        hp: calcHP(pokemon.hp, ivs.hp, evs.hp, level),
        attack: calcStat(pokemon.attack, ivs.attack, evs.attack, level),
        defense: calcStat(pokemon.defense, ivs.defense, evs.defense, level),
        spAtk: calcStat(pokemon.spAtk, ivs.spAtk, evs.spAtk, level),
        spDef: calcStat(pokemon.spDef, ivs.spDef, evs.spDef, level),
        speed: calcStat(pokemon.speed, ivs.speed, evs.speed, level),
    };
}
