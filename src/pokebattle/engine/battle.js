import { initTeam } from "./init.js";
import { executeMove } from "./turnLogic.js";
import { moritzTeam } from "../data/moritzTeam.js";
import { getActionAi, pickSwitchAi } from "./ai.js";
import { getSpeed } from "../utils/getters.js";

// mTeam = Moritz (AI), cTeam = Challenger (player)
let state = null;
let onUpdate = null;

function captureLog(fn) {
    const messages = [];
    const orig = console.log;
    console.log = (...args) => messages.push(args.map(String).join(" "));
    try {
        fn();
    } finally {
        console.log = orig;
    }
    return messages;
}

function getActive(team) {
    return team.find((p) => p.isActive);
}

function switchPokemon(team, pokemon) {
    team.forEach((p) => (p.isActive = false));
    pokemon.isActive = true;
}

function isDefeated(team) {
    return team.every((p) => p.fainted);
}

function notify(messages, isFinal = true) {
    return new Promise((resolve) => {
        onUpdate(state, messages, isFinal, resolve);
    });
}

// Short pause between animations
function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

export function startBattle(callback, challengerTeam) {
    onUpdate = callback;
    state = {
        mTeam: initTeam(moritzTeam),
        cTeam: initTeam(challengerTeam, false),
        phase: "pick-action",
        winner: null,
        mSwitchesLeft: 3,
    };
    notify(["Battle start! What will you do?"]);
}

export function getState() {
    return state;
}

export function selectFight() {
    state.phase = "pick-move";
    notify([]);
}

export function selectSwitch() {
    state.phase = "pick-switch";
    notify([]);
}

export function selectBack() {
    state.phase = "pick-action";
    notify([]);
}

// Processes faints, updates phase
async function _handleFaints(messages) {
    const moritzActive = getActive(state.mTeam);
    if (moritzActive && moritzActive.currentHp <= 0) {
        moritzActive.fainted = true;
        moritzActive.isActive = false;
        messages.push(`${moritzActive.name} fainted!`);
        const challengerActive = getActive(state.cTeam);
        const next = challengerActive
            ? pickSwitchAi(state.mTeam, challengerActive)
            : state.mTeam.find((p) => !p.fainted);
        if (next) {
            switchPokemon(state.mTeam, next);
            messages.push(`Moritz sends out ${next.name}!`);
        }
    }

    const challengerActive = getActive(state.cTeam);
    if (challengerActive && challengerActive.currentHp <= 0) {
        challengerActive.fainted = true;
        challengerActive.isActive = false;
        messages.push(`${challengerActive.name} fainted!`);
    }

    _checkWinCondition(messages);

    if (state.phase !== "game-over") {
        const playerHasActive = !!getActive(state.cTeam);
        const playerHasRemaining = state.cTeam.some((p) => !p.fainted);
        if (!playerHasActive && playerHasRemaining) {
            state.phase = "faint-switch";
        } else {
            state.phase = "pick-action";
        }
    }

    await notify(messages, true);
}

export async function playerFight(moveOrIndex) {
    const playerActive = getActive(state.cTeam);
    const playerMove =
        typeof moveOrIndex === "number"
            ? playerActive.moves[moveOrIndex]
            : moveOrIndex;
    const aiAction = getActionAi(
        state.mTeam,
        playerActive,
        state.mSwitchesLeft,
    );

    if (aiAction.type === "switch") {
        state.mSwitchesLeft--;
        switchPokemon(state.mTeam, aiAction.pokemon);
        await notify([`Moritz sends out ${aiAction.pokemon.name}!`], false);
        await sleep(700);

        const moritzActive = getActive(state.mTeam);
        const challengerActive = getActive(state.cTeam);
        const msgs = captureLog(() =>
            executeMove(challengerActive, moritzActive, playerMove),
        );
        if (Number.isFinite(playerMove.pp)) playerMove.currentPp--;
        await _handleFaints(msgs);
        return;
    }

    const moritzActive = getActive(state.mTeam);
    const challengerActive = getActive(state.cTeam);

    // Determine who attacks first by speed
    const playerSpeed = getSpeed(challengerActive);
    const aiSpeed = getSpeed(moritzActive);

    let first, firstMove, second, secondMove;
    const playerGoesFirst =
        playerSpeed > aiSpeed ||
        (playerSpeed === aiSpeed && Math.random() < 0.5);
    if (playerGoesFirst) {
        [first, firstMove, second, secondMove] = [
            challengerActive,
            playerMove,
            moritzActive,
            aiAction.move,
        ];
    } else {
        [first, firstMove, second, secondMove] = [
            moritzActive,
            aiAction.move,
            challengerActive,
            playerMove,
        ];
    }

    const msgs1 = captureLog(() => executeMove(first, second, firstMove));
    if (Number.isFinite(firstMove.pp)) firstMove.currentPp--;

    if (second.currentHp <= 0) {
        await _handleFaints(msgs1);
        return;
    }

    await notify(msgs1, false);

    const msgs2 = captureLog(() => executeMove(second, first, secondMove));
    if (Number.isFinite(secondMove.pp)) secondMove.currentPp--;

    await _handleFaints(msgs2);
}

export async function playerSwitch(pokemonIndex) {
    const oldPlayerActive = getActive(state.cTeam);
    const aiAction = getActionAi(
        state.mTeam,
        oldPlayerActive,
        state.mSwitchesLeft,
    );

    const available = state.cTeam.filter((p) => !p.fainted && !p.isActive);
    const chosen = available[pokemonIndex];
    switchPokemon(state.cTeam, chosen);

    await notify([`You sent out ${chosen.name}!`], false);

    await sleep(700);

    const playerActive = getActive(state.cTeam);

    if (aiAction.type === "switch") {
        state.mSwitchesLeft--;
        switchPokemon(state.mTeam, aiAction.pokemon);
        await notify([`Moritz sends out ${aiAction.pokemon.name}!`], false);
    } else {
        const moritzActive = getActive(state.mTeam);
        const msgs = captureLog(() =>
            executeMove(moritzActive, playerActive, aiAction.move),
        );
        aiAction.move.currentPp--;
        await _handleFaints(msgs);
    }

    if (aiAction.type === "switch") {
        state.phase = "pick-action";
        await notify([], true);
    }
}

export function playerFaintSwitch(pokemonIndex) {
    const available = state.cTeam.filter((p) => !p.fainted && !p.isActive);
    const chosen = available[pokemonIndex];
    switchPokemon(state.cTeam, chosen);
    const messages = [`Go, ${chosen.name}!`];

    _checkWinCondition(messages);
    if (state.phase !== "game-over") state.phase = "pick-action";
    notify(messages);
}

function _checkWinCondition(messages) {
    if (isDefeated(state.cTeam)) {
        state.phase = "game-over";
        state.winner = "opponent";
        messages.push("You lost! Better luck next time.");
    } else if (isDefeated(state.mTeam)) {
        state.phase = "game-over";
        state.winner = "player";
        messages.push("You won! Congratulations!");
    }
}
