import {
  startBattle,
  selectFight,
  selectSwitch,
  selectBack,
  playerFight,
  playerSwitch,
  playerFaintSwitch,
} from "./pokebattle/engine/battle.js";
import { challPokePool } from "./pokebattle/data/challPokePool.js";
import { movepool as allMoves } from "./pokebattle/data/movepool.js";

const TYPE_COLOR = {
  Fire: { bg: "#b94020", text: "#ffd4b5" },
  Water: { bg: "#1a5fb5", text: "#b8d8ff" },
  Grass: { bg: "#2d7d32", text: "#c8f0c8" },
  Electric: { bg: "#8a7000", text: "#ffe066" },
  Psychic: { bg: "#8b1a5e", text: "#ffb3e0" },
  Ice: { bg: "#1a6080", text: "#b8e8f8" },
  Dragon: { bg: "#4a2ea0", text: "#cbbfff" },
  Ghost: { bg: "#3d2060", text: "#d5b8ff" },
  Dark: { bg: "#2a2a3d", text: "#a8a8c8" },
  Fighting: { bg: "#8b1a1a", text: "#ffb8b8" },
  Poison: { bg: "#5e1a8b", text: "#e0b8ff" },
  Ground: { bg: "#7a5820", text: "#ffe0a0" },
  Rock: { bg: "#5a4a20", text: "#d4c890" },
  Bug: { bg: "#3a5a10", text: "#c8e890" },
  Flying: { bg: "#1a3a6a", text: "#b8d4f8" },
  Steel: { bg: "#304050", text: "#b8c8d8" },
  Fairy: { bg: "#7a2060", text: "#ffb8e8" },
  Normal: { bg: "#3a3a3a", text: "#c8c8c8" },
};

const $ = (id) => document.getElementById(id);

// Cache sprites
const spriteCache = new Map();

async function fetchSprite(name) {
  const key = name.toLowerCase();

  if (spriteCache.has(key)) return spriteCache.get(key);

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${key}`);
    if (!res.ok) throw new Error("not found");
    const data = await res.json();

    // Gen 5 sprites
    const bwAnim =
      data.sprites?.versions?.["generation-v"]?.["black-white"]?.animated;
    const urls = {
      front: bwAnim?.front_default || data.sprites?.front_default || "",
      back:
        bwAnim?.back_default ||
        data.sprites?.back_default ||
        data.sprites?.front_default ||
        "",
    };
    spriteCache.set(key, urls);
    return urls;
  } catch {
    const empty = { front: "", back: "" };
    spriteCache.set(key, empty);
    return empty;
  }
}

const spriteGen = { enemy: 0, player: 0 };

async function loadSprite(side, name, fainted = false) {
  const el = $(`${side}-sprite`);
  if (!el) return;

  const gen = ++spriteGen[side];
  const sprites = await fetchSprite(name);

  if (spriteGen[side] !== gen) return;

  const src = side === "enemy" ? sprites.front : sprites.back;

  if (el.dataset.pokemon !== name) {
    el.style.transition = "none";
    el.classList.remove("fainted");
    void el.offsetWidth;
    el.style.transition = "";
  }

  el.src = src;
  el.alt = name;
  el.dataset.pokemon = name;
  el.classList.toggle("fainted", fainted);
}

function runTransition(onCovered) {
  const canvas = $("battle-transition");
  const ctx = canvas.getContext("2d");
  const arena = canvas.parentElement;

  canvas.width = arena.offsetWidth;
  canvas.height = arena.offsetHeight;
  canvas.classList.add("active");

  const NUM_BARS = 8;
  const barH = canvas.height / NUM_BARS;
  const SLIDE_MS = 260;
  let start = null;

  function frame(now) {
    if (!start) start = now;
    const t = Math.min((now - start) / SLIDE_MS, 1);
    const ease = t * t * t * t;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#07090f";

    for (let i = 0; i < NUM_BARS; i++) {
      const fromLeft = i % 2 === 0;
      const barW = canvas.width * ease;
      const x = fromLeft ? 0 : canvas.width - barW;
      ctx.fillRect(x, i * barH, barW, barH + 1);
    }

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      onCovered();
      setTimeout(() => {
        canvas.classList.add("fade-out");
        canvas.addEventListener(
          "transitionend",
          () => canvas.classList.remove("active", "fade-out"),
          { once: true },
        );
      }, 80);
    }
  }

  requestAnimationFrame(frame);
}

let lastEnemy = null;
let lastPlayer = null;

const displayedHp = { enemy: null, player: null };
const hpAnimFrame = { enemy: null, player: null };
const hpAnimVersion = { enemy: 0, player: 0 };

function animateHpBar(side, toHp, maxHp) {
  if (hpAnimFrame[side]) cancelAnimationFrame(hpAnimFrame[side]);

  const bar = $(`${side}-hp-bar`);
  const hpText = $(`${side}-hp-text`);
  const fromHp = displayedHp[side] ?? maxHp;
  const version = ++hpAnimVersion[side];

  if (fromHp === toHp) {
    const pct = Math.max(0, (fromHp / maxHp) * 100);
    bar.style.width = `${pct}%`;
    bar.classList.remove("hp-yellow", "hp-red");
    if (pct <= 20) bar.classList.add("hp-red");
    else if (pct <= 50) bar.classList.add("hp-yellow");
    hpText.textContent = `${Math.max(0, Math.floor(fromHp))} / ${maxHp}`;
    displayedHp[side] = toHp;
    return;
  }

  const DURATION = 800;
  let start = null;

  function frame(now) {
    if (hpAnimVersion[side] !== version) return;

    if (!start) start = now;
    const t = Math.min((now - start) / DURATION, 1);

    const eased = 1 - Math.pow(1 - t, 3);
    const currentHp = fromHp + (toHp - fromHp) * eased;
    const pct = Math.max(0, (currentHp / maxHp) * 100);

    bar.style.width = `${pct}%`;

    bar.classList.remove("hp-yellow", "hp-red");
    if (pct <= 20) bar.classList.add("hp-red");
    else if (pct <= 50) bar.classList.add("hp-yellow");

    hpText.textContent = `${Math.max(0, Math.floor(currentHp))} / ${maxHp}`;

    if (t < 1) {
      hpAnimFrame[side] = requestAnimationFrame(frame);
    } else {
      displayedHp[side] = toHp;
      hpAnimFrame[side] = null;
    }
  }

  hpAnimFrame[side] = requestAnimationFrame(frame);
}

function updatePanel(side, pokemon) {
  $(`${side}-name`).textContent = pokemon.name;

  animateHpBar(side, pokemon.currentHp, pokemon.maxHp);

  if (displayedHp[side] === null) {
    displayedHp[side] = pokemon.maxHp;
  }

  const typesEl = $(`${side}-types`);
  typesEl.innerHTML = "";
  (pokemon.type || []).forEach((t) => {
    const badge = document.createElement("span");
    badge.className = "type-badge";
    badge.textContent = t;
    const colors = TYPE_COLOR[t] || { bg: "#333", text: "#ccc" };
    badge.style.background = colors.bg;
    badge.style.color = colors.text;
    typesEl.appendChild(badge);
  });
}

let _msgTimer = null;
let _charTimer = null;

function displayMessages(messages, onDone) {
  clearTimeout(_msgTimer);
  clearTimeout(_charTimer);

  $("battle-actions").innerHTML = "";
  const log = $("battle-log");

  if (!messages || messages.length === 0) {
    _msgTimer = setTimeout(() => onDone?.(), 200);
    return;
  }

  let msgIdx = 0;

  function showNext() {
    if (msgIdx >= messages.length) {
      _msgTimer = setTimeout(() => onDone?.(), 500);
      return;
    }

    const text = messages[msgIdx++];
    log.textContent = "";
    let charIdx = 0;

    function typeChar() {
      if (charIdx < text.length) {
        log.textContent += text[charIdx++];
        _charTimer = setTimeout(typeChar, 38);
      } else {
        _msgTimer = setTimeout(showNext, 700);
      }
    }

    typeChar();
  }

  showNext();
}

function btn(label, onClick) {
  const b = document.createElement("button");
  b.textContent = label;
  b.addEventListener("click", () => {
    $("battle-actions").innerHTML = "";
    onClick();
  });
  return b;
}

function moveBtn(move, onClick) {
  const b = document.createElement("button");
  b.className = "move-btn";

  const colors = TYPE_COLOR[move.type] || { bg: "#333", text: "#ccc" };

  const accDisplay = move.accuracy === 0 ? "—" : `${move.accuracy}%`;
  const ppDisplay = Number.isFinite(move.pp)
    ? `${move.currentPp}/${move.pp}`
    : "—";

  b.innerHTML = `
        <div class="move-body">
            <span class="move-name">${move.name}</span>
            <div class="move-stats">
                <span class="move-stat">
                    <span class="stat-label">PWR</span>
                    <span class="stat-val stat-val--pwr">${move.power}</span>
                </span>
                <span class="stat-sep">·</span>
                <span class="move-stat">
                    <span class="stat-label">ACC</span>
                    <span class="stat-val stat-val--acc">${accDisplay}</span>
                </span>
                <span class="stat-sep">·</span>
                <span class="move-stat">
                    <span class="stat-label">PP</span>
                    <span class="stat-val">${ppDisplay}</span>
                </span>
            </div>
        </div>
        <span class="move-type-badge" style="background:${colors.bg};color:${colors.text}">${move.type}</span>
    `;

  b.addEventListener("click", () => {
    $("battle-actions").innerHTML = "";
    onClick();
  });
  return b;
}

function renderActions(state) {
  const container = $("battle-actions");
  container.innerHTML = "";

  const decisionPhases = [
    "pick-action",
    "pick-move",
    "pick-switch",
    "faint-switch",
  ];
  if (decisionPhases.includes(state.phase)) {
    $("battle-log").textContent = "What will you do?";
  }

  switch (state.phase) {
    case "pick-action":
      container.append(btn("FIGHT", selectFight), btn("SWITCH", selectSwitch));
      break;

    case "pick-move": {
      const active = state.cTeam.find((p) => p.isActive);
      const haspp = active.moves.some((m) => m.currentPp > 0);

      if (!haspp) {
        container.append(
          moveBtn(allMoves.struggle, () => playerFight(allMoves.struggle)),
        );
      } else {
        active.moves.forEach((move, i) => {
          if (move.currentPp > 0)
            container.append(moveBtn(move, () => playerFight(i)));
        });
      }
      container.append(btn("BACK", selectBack));
      break;
    }

    case "pick-switch": {
      const avail = state.cTeam.filter((p) => !p.fainted && !p.isActive);
      avail.forEach((p, i) => {
        const pct = Math.round((p.currentHp / p.maxHp) * 100);
        container.append(btn(`${p.name}  ${pct}%`, () => playerSwitch(i)));
      });
      container.append(btn("BACK", selectBack));
      break;
    }

    case "faint-switch": {
      const avail = state.cTeam.filter((p) => !p.fainted && !p.isActive);
      avail.forEach((p, i) => {
        const pct = Math.round((p.currentHp / p.maxHp) * 100);
        container.append(btn(`${p.name}  ${pct}%`, () => playerFaintSwitch(i)));
      });
      break;
    }

    case "game-over":
      container.append(btn("PLAY AGAIN", () => location.reload()));
      break;
  }
}

function onUpdate(state, messages, isFinal = true, done) {
  const enemy = state.mTeam.find((p) => p.isActive);
  const player = state.cTeam.find((p) => p.isActive);

  const firstLoad = lastEnemy === null && lastPlayer === null;
  const enemySwitched = !firstLoad && enemy && lastEnemy?.name !== enemy.name;
  const playerSwitched =
    !firstLoad && player && lastPlayer?.name !== player.name;

  if (enemySwitched) {
    updatePanel("enemy", lastEnemy);
  } else {
    if (enemy) {
      lastEnemy = enemy;
      updatePanel("enemy", enemy);
    } else if (lastEnemy) {
      updatePanel("enemy", lastEnemy);
    }
  }

  if (playerSwitched) {
    updatePanel("player", lastPlayer);
  } else {
    if (player) {
      lastPlayer = player;
      updatePanel("player", player);
    } else if (lastPlayer) {
      updatePanel("player", lastPlayer);
    }
  }

  if (firstLoad) {
    if (enemy) loadSprite("enemy", enemy.name, false);
    if (player) loadSprite("player", player.name, false);
  }

  displayMessages(messages, () => {
    if (!firstLoad) {
      if (enemySwitched) {
        lastEnemy = enemy;
        loadSprite("enemy", enemy.name, false);
        setTimeout(() => {
          displayedHp.enemy = enemy.currentHp;
          updatePanel("enemy", enemy);
        }, 350);
      } else {
        if (enemy) loadSprite("enemy", enemy.name, false);
        else if (lastEnemy) loadSprite("enemy", lastEnemy.name, true);
      }

      if (playerSwitched) {
        lastPlayer = player;
        loadSprite("player", player.name, false);
        setTimeout(() => {
          displayedHp.player = player.currentHp;
          updatePanel("player", player);
        }, 350);
      } else {
        if (player) loadSprite("player", player.name, false);
        else if (lastPlayer) loadSprite("player", lastPlayer.name, true);
      }
    }

    if (isFinal) renderActions(state);

    done?.();
  });
}

const selectedPokemon = [];
const MAX_TEAM_SIZE = 6;

function typeBadge(type, small = false) {
  const colors = TYPE_COLOR[type] || { bg: "#333", text: "#ccc" };
  const span = document.createElement("span");
  span.className = small ? "type-badge type-badge--sm" : "type-badge";
  span.textContent = type;
  span.style.background = colors.bg;
  span.style.color = colors.text;
  return span;
}

function updateSelectionState() {
  const count = selectedPokemon.length;
  $("team-counter").textContent = `${count} / ${MAX_TEAM_SIZE}`;
  $("battle-btn").disabled = count !== MAX_TEAM_SIZE;

  document.querySelectorAll(".poke-card").forEach((card) => {
    const name = card.dataset.name;
    const orderIdx = selectedPokemon.indexOf(name);
    const isSelected = orderIdx !== -1;
    card.classList.toggle("selected", isSelected);
    card.classList.toggle("disabled", !isSelected && count >= MAX_TEAM_SIZE);

    const badge = card.querySelector(".poke-card-order");
    if (badge) {
      badge.textContent = isSelected ? orderIdx + 1 : "";
      badge.classList.toggle("visible", isSelected);
      badge.classList.toggle("lead", orderIdx === 0);
    }
  });
}

function buildSelectionGrid() {
  const pool = $("pokemon-pool");
  pool.innerHTML = "";

  challPokePool.forEach((pokemon) => {
    const card = document.createElement("div");
    card.className = "poke-card";
    card.dataset.name = pokemon.name;

    const header = document.createElement("div");
    header.className = "poke-card-header";

    const info = document.createElement("div");
    info.className = "poke-card-info";
    const nameEl = document.createElement("span");
    nameEl.className = "poke-card-name";
    nameEl.textContent = pokemon.name;
    const typesEl = document.createElement("div");
    typesEl.className = "poke-card-types";
    pokemon.type.forEach((t) => typesEl.appendChild(typeBadge(t)));
    info.append(nameEl, typesEl);

    const spriteImg = document.createElement("img");
    spriteImg.className = "poke-card-sprite";
    spriteImg.alt = pokemon.name;
    fetchSprite(pokemon.name).then((urls) => {
      spriteImg.src = urls.front;
    });

    header.append(info, spriteImg);

    const moveList = document.createElement("ul");
    moveList.className = "poke-card-moves";
    pokemon.moves.forEach((move) => {
      const li = document.createElement("li");
      li.appendChild(typeBadge(move.type, true));
      const moveName = document.createElement("span");
      moveName.textContent = move.name;
      li.appendChild(moveName);
      moveList.appendChild(li);
    });

    const orderBadge = document.createElement("div");
    orderBadge.className = "poke-card-order";

    card.append(orderBadge, header, moveList);

    card.addEventListener("click", () => {
      if (card.classList.contains("disabled")) return;
      const idx = selectedPokemon.indexOf(pokemon.name);
      if (idx !== -1) {
        selectedPokemon.splice(idx, 1);
      } else {
        selectedPokemon.push(pokemon.name);
      }
      updateSelectionState();
    });

    pool.appendChild(card);
  });
}

$("challenge-btn").addEventListener("click", () => {
  $("battle-intro").classList.add("is-hidden");
  buildSelectionGrid();
  $("team-select").classList.add("is-visible");
});

$("battle-btn").addEventListener("click", () => {
  const chosen = selectedPokemon.map((name) =>
    challPokePool.find((p) => p.name === name),
  );
  runTransition(() => {
    $("team-select").classList.remove("is-visible");
    $("battle-window").classList.add("is-visible");
    startBattle(onUpdate, chosen);
  });
});
