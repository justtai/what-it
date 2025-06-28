import { PRIZES, CURSES } from './constants.js';
import { playSound, stopHoverSound } from './audio.js';
import { animateEliminatedValue } from './ui.js';
import { gsap } from 'gsap';
import { getInitialGameState } from './state.js';

export function startGame(room, isMultiplayer) {
    playSound('start_sound');

    const initialState = getInitialGameState();
    initialState.gameStartedBy = room.clientId;
    initialState.isMultiplayer = isMultiplayer;

    const prizesWithTypes = PRIZES.map(p => ({ ...p, type: 'prize' }));
    const cursesWithTypes = CURSES.map(c => ({ ...c, type: 'curse' }));
    let content = [...prizesWithTypes, ...cursesWithTypes];

    // Shuffle content using the gameSeed for consistency across clients
    let m = content.length, t, i;
    let seed = initialState.gameSeed;
    while (m) {
        const random = Math.sin(seed++) * 10000;
        i = Math.floor((random - Math.floor(random)) * m--);
        t = content[m];
        content[m] = content[i];
        content[i] = t;
    }

    const orbs = content.slice(0, 32).map((item, index) => ({
        id: index,
        content: item,
        state: 'closed',
    }));
    
    initialState.orbs = orbs.reduce((acc, orb) => {
        acc[orb.id] = orb;
        return acc;
    }, {});

    initialState.dollarValues = orbs.map(orb => orb.content.value).sort((a, b) => a - b);
    initialState.remainingValues = [...initialState.dollarValues];
    
    const turnOrder = isMultiplayer ? Object.keys(room.peers).sort(() => Math.random() - 0.5) : [room.clientId];

    initialState.currentState = 'CHOOSE_ORB';
    initialState.turnOrder = turnOrder;
    initialState.currentPlayerId = turnOrder[0];

    room.updateRoomState(initialState);
}

export function handleOrbClick(orb, room) {
    stopHoverSound();
    if (orb.state !== 'closed') return;

    const myClientId = room.clientId;
    const roomState = room.roomState;

    if (roomState.currentState === 'CHOOSE_ORB') {
        if(room.presence[myClientId]?.playerOrb) return;
        playSound('orb_select');
        
        room.updatePresence({
            playerOrb: roomState.orbs[orb.id],
            status: 'playing',
        });
        
    } else if (roomState.currentState === 'ELIMINATE') {
        if (myClientId !== roomState.currentPlayerId) return;

        playSound('orb_open');
        const gameContainer = document.getElementById('game-container');
        const orbEl = gameContainer.querySelector(`.orb[data-id="${orb.id}"]`);
        room.send({ type: 'orb_elimination_start', orbId: orb.id, orbRect: orbEl.getBoundingClientRect() });
    }
}

export function handleOrbElimination(data, room) {
    const { orbId, orbRect } = data;
    const roomState = room.roomState;

    const updatedOrbs = { ...roomState.orbs };
    updatedOrbs[orbId].state = 'opened';
    
    const gameContainer = document.getElementById('game-container');
    const orbEl = gameContainer.querySelector(`.orb[data-id="${orbId}"]`);
    if (orbEl) orbEl.style.visibility = 'hidden';

    const animationOverlay = document.getElementById('animation-overlay');
    const gameContainerRect = gameContainer.getBoundingClientRect();

    const flyingOrb = document.createElement('div');
    flyingOrb.className = 'orb';
    animationOverlay.appendChild(flyingOrb);

    gsap.set(flyingOrb, {
        position: 'absolute',
        left: orbRect.left,
        top: orbRect.top,
        width: orbRect.width,
        height: orbRect.height,
        zIndex: 1000,
    });
    
    gsap.timeline({
        onComplete: () => {
            animationOverlay.innerHTML = '';
            if (room.clientId === roomState.currentPlayerId) {
                playSound('reveal_sound');
                room.updateRoomState({
                    lastRevealedContent: roomState.orbs[orbId].content,
                    currentState: 'REVEAL_ORB',
                    openedOrbsCount: roomState.openedOrbsCount + 1,
                    roundEliminationCount: roomState.roundEliminationCount + 1,
                    orbs: updatedOrbs,
                });
            }
        }
    })
    .to(flyingOrb, {
        left: gameContainerRect.left + gameContainerRect.width / 2 - orbRect.width / 2,
        top: gameContainerRect.top + gameContainerRect.height / 2 - orbRect.height / 2,
        scale: 2,
        duration: 0.6,
        ease: 'power2.in'
    })
    .to(flyingOrb, {
        rotationY: 360, 
        scale: 0, 
        opacity: 0, 
        duration: 0.4,
        ease: 'power1.in'
    });
}

export function handleContinueAfterReveal(room) {
    const roomState = room.roomState;
    const revealedValue = roomState.lastRevealedContent.value;
    const isCurseContent = roomState.lastRevealedContent.type === 'curse';

    const newRemainingValues = roomState.remainingValues.filter(v => v !== revealedValue);
    
    const roundSize = roomState.eliminationRounds[0];
    if (roomState.roundEliminationCount >= roundSize) {
        const remainingPlayers = Object.values(room.presence).filter(p => p.status === 'playing');
        if (remainingPlayers.length > 0) {
            triggerOffer(newRemainingValues, room);
            return;
        }
    }
    
    const activePlayers = roomState.turnOrder.filter(id => room.presence[id]?.status === 'playing');
    const currentPlayerIndex = activePlayers.indexOf(roomState.currentPlayerId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % activePlayers.length;
    const nextPlayerId = activePlayers[nextPlayerIndex];

    room.updateRoomState({
        remainingValues: newRemainingValues,
        currentState: 'ELIMINATE',
        currentPlayerId: nextPlayerId,
    });
    
    animateEliminatedValue(revealedValue, isCurseContent);
}

function triggerOffer(newRemainingValues, room) {
    playSound('offer_sound');
    
    let offer;
    if (Math.random() < 0.25) {
        offer = { type: 'mystery_box', text: `The host makes a special offer... a Mystery Box!`, image: 'mystery_box.png' };
    } else {
        const sum = newRemainingValues.reduce((acc, val) => acc + val, 0);
        const mean = sum / newRemainingValues.length;
        const riskFactor = Math.random() * 0.4 + 0.5; 
        const offerValue = Math.floor(mean * riskFactor);
        offer = { type: 'cash', value: offerValue, text: `The host offers you...` };
    }

    Object.keys(room.peers).forEach(id => {
        if (room.presence[id]?.status === 'playing') {
            room.updatePresence({ ...room.presence[id], status: 'making_offer_decision' }, id);
        }
    });

    room.updateRoomState({
        currentState: 'OFFER',
        currentOffer: offer,
        roundEliminationCount: 0,
        remainingValues: newRemainingValues
    });
}

export function handleOffer(accepted, room) {
    const myClientId = room.clientId;
    if (!accepted) {
        room.updatePresence({ status: 'playing' });
        return;
    }
    
    const roomState = room.roomState;
    let finalDecision;
    if (roomState.currentOffer.type === 'mystery_box') {
        const allItems = [...PRIZES.map(p => ({ ...p, type: 'prize' })), ...CURSES.map(c => ({ ...c, type: 'curse' }))];
        const itemsInPlay = new Set(Object.values(roomState.orbs).map(orb => orb.content.text));
        const possibleMysteryItems = allItems.filter(item => !itemsInPlay.has(item.text));
        const mysteryItem = possibleMysteryItems[Math.floor(Math.random() * possibleMysteryItems.length)];
        finalDecision = { type: 'mystery_box_result', value: mysteryItem };
    } else {
        finalDecision = { type: 'deal', value: roomState.currentOffer.value };
    }

    room.updatePresence({ status: 'took_deal', finalDecision });
}

export function revealFinalOrb(chosenOrb, room) {
    const playerOrb = room.presence[room.clientId].playerOrb;
    const lastRemainingOrb = Object.values(room.roomState.orbs).find(o => o.state === 'closed');
    const otherOrb = chosenOrb.id === playerOrb.id ? lastRemainingOrb : playerOrb;

    room.updatePresence({
        status: 'finished_game',
        finalDecision: {
            type: 'final_choice',
            chosenOrbContent: chosenOrb.content,
            otherOrbContent: otherOrb.content
        }
    });
}

export function resetGame(room) {
    if (room.clientId !== room.roomState.gameStartedBy) return;
    const gameContainer = document.getElementById('game-container');
    gsap.to(gameContainer, { backgroundColor: 'rgba(0, 0, 0, 0.5)', duration: 0.5 });
    
    room.updateRoomState(getInitialGameState());
    Object.keys(room.peers).forEach(id => {
        room.updatePresence({ status: 'waiting', playerOrb: null, finalDecision: null }, id);
    });
}