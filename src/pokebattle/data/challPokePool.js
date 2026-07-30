import { movepool } from "./movepool.js";

export const challPokePool = [
  // 1
  {
    name: "Charizard",
    type: ["Fire", "Flying"],
    hp: 78,
    attack: 84,
    defense: 78,
    spAtk: 109,
    spDef: 85,
    speed: 100,

    evs: {
      hp: 4,
      attack: 0,
      defense: 0,
      spAtk: 252,
      spDef: 0,
      speed: 252,
    },

    ivs: {
      hp: 31,
      attack: 31,
      defense: 31,
      spAtk: 31,
      spDef: 31,
      speed: 31,
    },

    moves: [
      movepool.flamethrower,
      movepool.airslash,
      movepool.crunch,
      movepool.dragonpulse,
    ],
  },

  // 2
  {
    name: "Froslass",
    type: ["Ice", "Ghost"],
    hp: 70,
    attack: 80,
    defense: 70,
    spAtk: 80,
    spDef: 70,
    speed: 110,

    evs: {
      hp: 4,
      attack: 0,
      defense: 0,
      spAtk: 252,
      spDef: 0,
      speed: 252,
    },

    ivs: {
      hp: 31,
      attack: 31,
      defense: 31,
      spAtk: 31,
      spDef: 31,
      speed: 31,
    },

    moves: [
      movepool.blizzard,
      movepool.shadowball,
      movepool.psychic,
      movepool.icebeam,
    ],
  },

  // 3
  {
    name: "Vaporeon",
    type: ["Water"],
    hp: 130,
    attack: 65,
    defense: 60,
    spAtk: 110,
    spDef: 95,
    speed: 65,

    evs: {
      hp: 252,
      attack: 0,
      defense: 252,
      spAtk: 0,
      spDef: 4,
      speed: 0,
    },

    ivs: {
      hp: 31,
      attack: 31,
      defense: 31,
      spAtk: 31,
      spDef: 31,
      speed: 31,
    },

    moves: [
      movepool.hydropump,
      movepool.icebeam,
      movepool.hypervoice,
      movepool.alluringvoice,
    ],
  },

  // 4
  {
    name: "Electivire",
    type: ["Electric"],
    hp: 75,
    attack: 123,
    defense: 67,
    spAtk: 95,
    spDef: 85,
    speed: 95,

    evs: {
      hp: 4,
      attack: 252,
      defense: 0,
      spAtk: 0,
      spDef: 0,
      speed: 252,
    },

    ivs: {
      hp: 31,
      attack: 31,
      defense: 31,
      spAtk: 31,
      spDef: 31,
      speed: 31,
    },

    moves: [
      movepool.thunderpunch,
      movepool.brickbreak,
      movepool.firepunch,
      movepool.icepunch,
    ],
  },

  // 5
  {
    name: "Slowking",
    type: ["Water", "Psychic"],
    hp: 95,
    attack: 75,
    defense: 80,
    spAtk: 100,
    spDef: 110,
    speed: 30,

    evs: {
      hp: 252,
      attack: 0,
      defense: 4,
      spAtk: 0,
      spDef: 252,
      speed: 0,
    },

    ivs: {
      hp: 31,
      attack: 31,
      defense: 31,
      spAtk: 31,
      spDef: 31,
      speed: 31,
    },

    moves: [
      movepool.surf,
      movepool.icebeam,
      movepool.psychic,
      movepool.shadowball,
    ],
  },

  // 6
  {
    name: "Salamence",
    type: ["Dragon", "Flying"],
    hp: 95,
    attack: 135,
    defense: 80,
    spAtk: 110,
    spDef: 80,
    speed: 100,

    evs: {
      hp: 4,
      attack: 252,
      defense: 0,
      spAtk: 0,
      spDef: 0,
      speed: 252,
    },

    ivs: {
      hp: 31,
      attack: 31,
      defense: 31,
      spAtk: 31,
      spDef: 31,
      speed: 31,
    },

    moves: [
      movepool.earthquake,
      movepool.dragonclaw,
      movepool.aerialace,
      movepool.thunderfang,
    ],
  },

  // 7
  {
    name: "Hydreigon",
    type: ["Dark", "Dragon"],
    hp: 92,
    attack: 105,
    defense: 90,
    spAtk: 125,
    spDef: 90,
    speed: 98,

    evs: {
      hp: 4,
      attack: 0,
      defense: 0,
      spAtk: 252,
      spDef: 0,
      speed: 252,
    },

    ivs: {
      hp: 31,
      attack: 31,
      defense: 31,
      spAtk: 31,
      spDef: 31,
      speed: 31,
    },

    moves: [
      movepool.dragonpulse,
      movepool.darkpulse,
      movepool.flamethrower,
      movepool.focusblast,
    ],
  },

  // 8
  {
    name: "Gardevoir",
    type: ["Psychic", "Fairy"],
    hp: 68,
    attack: 65,
    defense: 65,
    spAtk: 125,
    spDef: 115,
    speed: 80,

    evs: {
      hp: 4,
      attack: 0,
      defense: 0,
      spAtk: 252,
      spDef: 0,
      speed: 252,
    },

    ivs: {
      hp: 31,
      attack: 31,
      defense: 31,
      spAtk: 31,
      spDef: 31,
      speed: 31,
    },

    moves: [
      movepool.psychic,
      movepool.shadowball,
      movepool.hypervoice,
      movepool.moonblast,
    ],
  },

  // 9
  {
    name: "Kangaskhan",
    type: ["Normal"],
    hp: 105,
    attack: 95,
    defense: 80,
    spAtk: 40,
    spDef: 80,
    speed: 90,

    evs: {
      hp: 52,
      attack: 180,
      defense: 36,
      spAtk: 0,
      spDef: 8,
      speed: 232,
    },

    ivs: {
      hp: 31,
      attack: 31,
      defense: 31,
      spAtk: 31,
      spDef: 31,
      speed: 31,
    },

    moves: [
      movepool.drainpunch,
      movepool.shadowclaw,
      movepool.headbutt,
      movepool.rockslide,
    ],
  },

  // 10
  {
    name: "Leafeon",
    type: ["Grass"],
    hp: 65,
    attack: 110,
    defense: 130,
    spAtk: 60,
    spDef: 65,
    speed: 95,

    evs: {
      hp: 0,
      attack: 252,
      defense: 0,
      spAtk: 0,
      spDef: 4,
      speed: 252,
    },

    ivs: {
      hp: 31,
      attack: 31,
      defense: 31,
      spAtk: 31,
      spDef: 31,
      speed: 31,
    },

    moves: [
      movepool.seedbomb,
      movepool.xscissor,
      movepool.bodyslam,
      movepool.aerialace,
    ],
  },

  // 11
  {
    name: "Aggron",
    type: ["Steel", "Rock"],
    hp: 70,
    attack: 110,
    defense: 180,
    spAtk: 60,
    spDef: 60,
    speed: 50,

    evs: {
      hp: 252,
      attack: 0,
      defense: 4,
      spAtk: 0,
      spDef: 252,
      speed: 0,
    },

    ivs: {
      hp: 31,
      attack: 31,
      defense: 31,
      spAtk: 31,
      spDef: 31,
      speed: 31,
    },

    moves: [
      movepool.ironhead,
      movepool.rockslide,
      movepool.headbutt,
      movepool.earthquake,
    ],
  },

  // 12
  {
    name: "Roserade",
    type: ["Grass", "Poison"],
    hp: 60,
    attack: 70,
    defense: 65,
    spAtk: 125,
    spDef: 105,
    speed: 90,

    evs: {
      hp: 4,
      attack: 0,
      defense: 0,
      spAtk: 252,
      spDef: 0,
      speed: 252,
    },

    ivs: {
      hp: 31,
      attack: 31,
      defense: 31,
      spAtk: 31,
      spDef: 31,
      speed: 31,
    },

    moves: [
      movepool.energyball,
      movepool.sludgebomb,
      movepool.dazzlinggleam,
      movepool.extrasensory,
    ],
  },
];
