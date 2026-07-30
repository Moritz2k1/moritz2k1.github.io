import { movepool } from "./movepool.js";

export const moritzTeam = [
  {
    name: "Victini",
    type: ["Fire", "Psychic"],
    hp: 100,
    attack: 100,
    defense: 100,
    spAtk: 100,
    spDef: 100,
    speed: 100,

    evs: {
      hp: 0,
      attack: 152,
      defense: 0,
      spAtk: 104,
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
      movepool.vcreate,
      movepool.boltstrike,
      movepool.psychic,
      movepool.energyball,
    ],
  },

  {
    name: "Dragonite",
    type: ["Dragon", "Flying"],
    hp: 91,
    attack: 134,
    defense: 95,
    spAtk: 100,
    spDef: 100,
    speed: 80,

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
      movepool.dragonclaw,
      movepool.earthquake,
      movepool.ironhead,
      movepool.aquatail,
    ],
  },

  {
    name: "Milotic",
    type: ["Water"],
    hp: 95,
    attack: 60,
    defense: 79,
    spAtk: 100,
    spDef: 125,
    speed: 81,

    evs: {
      hp: 252,
      attack: 0,
      defense: 100,
      spAtk: 0,
      spDef: 156,
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
      movepool.dragonpulse,
      movepool.drainingkiss,
    ],
  },

  {
    name: "Gengar",
    type: ["Ghost", "Poison"],
    hp: 60,
    attack: 65,
    defense: 60,
    spAtk: 130,
    spDef: 75,
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
      movepool.shadowball,
      movepool.darkpulse,
      movepool.sludgebomb,
      movepool.dazzlinggleam,
    ],
  },

  {
    name: "Rhyperior",
    type: ["Ground", "Rock"],
    hp: 115,
    attack: 140,
    defense: 130,
    spAtk: 55,
    spDef: 55,
    speed: 40,

    evs: {
      hp: 100,
      attack: 156,
      defense: 0,
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
      movepool.earthquake,
      movepool.stoneedge,
      movepool.icepunch,
      movepool.megahorn,
    ],
  },

  {
    name: "Snorlax",
    type: ["Normal"],
    hp: 160,
    attack: 110,
    defense: 65,
    spAtk: 65,
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
      movepool.bodyslam,
      movepool.icepunch,
      movepool.thunderpunch,
      movepool.firepunch,
    ],
  },
];
