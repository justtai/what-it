import { html } from 'lit-html';
import { render, startScreen, gameScreen, revealOrbScreen, offerModal, finalChoiceScreen, endScreen, addAnimationTimeline, updatePlayerList } from './ui.js';
import { initAudio, loadSound, playSound, playHoverSound, getBackgroundMusicSource, setBackgroundMusicSource } from './audio.js';
import { getInitialGameState } from './state.js';
import * as game from './game.js';

const gameContainer = document.getElementById('game-container');
const room = new WebsimSocket();
window.room = room; // Make it globally available for convenience in modules

// --- GAME LOGIC ---

function renderUI() {
    const roomState = room.roomState;
    const presence = room.presence;
    const peers = room.peers;
    const myClientId = room.clientId;

    if (!roomState || Object.keys(roomState).length === 0) {
        render(html`<div class="screen"><p>Connecting to the game...</p></div>`, gameContainer);
        return;
    }
    
    updatePlayerList(presence, peers, roomState);

    let view;
    switch (roomState.currentState) {
        case 'WAITING':
            view = startScreen(
                (isMultiplayer) => game.startGame(room, isMultiplayer), 
                roomState, 
                room
            );
            break;
        case 'CHOOSE_ORB':
            const waitingOn = Object.values(peers).filter(p => !presence[p.id]?.playerOrb).map(p => p.username).join(', ');
            view = gameScreen(roomState, presence, room, `Choose your orb! Waiting on: ${waitingOn}`, (orb) => game.handleOrbClick(orb, room), playHoverSound, addAnimationTimeline);
            break;
        case 'ELIMINATE':
            const remainingForOffer = roomState.eliminationRounds[0] - roomState.roundEliminationCount;
            const currentPlayer = peers[roomState.currentPlayerId];
            const message = myClientId === roomState.currentPlayerId 
                ? `Your turn! Open ${remainingForOffer} more orb${remainingForOffer !== 1 ? 's' : ''} to get an offer.`
                : `Waiting for ${currentPlayer.username} to pick.`;

            view = gameScreen(roomState, presence, room, message, (orb) => game.handleOrbClick(orb, room), playHoverSound, addAnimationTimeline);
            break;
        case 'REVEAL_ORB':
            view = revealOrbScreen(roomState.lastRevealedContent, () => game.handleContinueAfterReveal(room));
            break;
        case 'OFFER':
            view = offerModal(roomState.currentOffer, (accepted) => game.handleOffer(accepted, room));
            break;
        case 'FINAL':
            view = finalChoiceScreen(roomState, (orb) => game.revealFinalOrb(orb, room));
            break;
        case 'END':
            view = endScreen(roomState, presence, peers, () => game.resetGame(room));
            break;
        default:
             view = startScreen(() => game.startGame(room), roomState, room);
    }
    if (view) {
        render(view, gameContainer);
    }
}

// --- INITIALIZATION ---
async function main() {
    await room.initialize();
    
    initAudio();
    Promise.all([
        loadSound('start_sound', 'start_sound.mp3'),
        loadSound('orb_select', 'orb_select.mp3'),
        loadSound('orb_open', 'orb_open.mp3'),
        loadSound('reveal_sound', 'reveal_sound.mp3'),
        loadSound('offer_sound', 'offer_sound.mp3'),
        loadSound('win_sound', 'win_sound.mp3'),
        loadSound('curse_sound', 'curse_sound.mp3'),
        loadSound('background_music', 'background_music.mp3'),
        loadSound('orb_hover', 'orb_hover.mp3'),
    ]).then(() => {
        if (!getBackgroundMusicSource()) {
            setBackgroundMusicSource(playSound('background_music', true));
        }
    });

    room.subscribeRoomState(roomState => {
        if (roomState.currentState === 'OFFER') {
            const undecidedPlayers = Object.values(room.presence).filter(p => p.status === 'making_offer_decision');
            if (undecidedPlayers.length === 0) {
                 const activePlayers = room.roomState.turnOrder.filter(id => room.presence[id]?.status === 'playing');
                 
                 if(activePlayers.length === 0) {
                    room.updateRoomState({ currentState: 'END' });
                    return;
                 }
                 
                 // Total unopened orbs = orbs on board ('closed') + orbs held by active players
                 const closedOrbsCount = Object.values(roomState.orbs).filter(o => o.state === 'closed').length;
                 const totalUnopenedCount = closedOrbsCount + activePlayers.length;

                 if (totalUnopenedCount <= 2) {
                     room.updateRoomState({ currentState: 'FINAL' });
                 } else {
                    const currentPlayerIndex = activePlayers.indexOf(roomState.currentPlayerId);
                    // If current player is out, move to the next available one
                    const nextPlayerId = activePlayers.includes(roomState.currentPlayerId) 
                        ? roomState.currentPlayerId 
                        : activePlayers[0];
                    room.updateRoomState({ currentState: 'ELIMINATE', currentPlayerId: nextPlayerId });
                 }
            }
        }
        
        if (roomState.currentState === 'FINAL') {
            const playersInFinal = Object.values(room.presence).filter(p => p.playerOrb && p.status !== 'took_deal' && p.status !== 'saw_final_reveal');
            const finishedPlayersInFinal = playersInFinal.filter(p => p.status === 'finished_game');
            if (playersInFinal.length > 0 && playersInFinal.length === finishedPlayersInFinal.length) {
                // This condition is tricky. A better check is to see if all players who *should* be in the final have acknowledged it.
                const allDone = Object.values(room.presence)
                                    .filter(p => p.playerOrb && p.status !== 'took_deal') // all who entered the final
                                    .every(p => p.status === 'saw_final_reveal'); // have they all seen their result?

                if (allDone) {
                    room.updateRoomState({ currentState: 'END' });
                }
            }
        }
        renderUI();
    });

    room.subscribePresence(() => {
        const roomState = room.roomState;
        
        if (roomState.currentState !== 'WAITING' && roomState.currentState !== 'END' && !room.presence[room.clientId]?.status) {
            room.updatePresence({ status: 'took_deal', finalDecision: {type: 'deal', value: 0, text: 'Joined Late' } });
        }
        
        if(roomState.currentState === 'WAITING' && Object.keys(room.peers).length === 1 && !roomState.gameStartedBy) {
            room.updateRoomState({ gameStartedBy: room.clientId });
        }

        if (roomState.currentState === 'CHOOSE_ORB') {
            const allPlayers = roomState.isMultiplayer ? Object.keys(room.peers) : [room.clientId];
            const allChosen = allPlayers.every(id => room.presence[id]?.playerOrb);
            
            if (allChosen) {
                const updatedOrbs = { ...roomState.orbs };
                let hasChanges = false;
                 Object.keys(room.presence).forEach(clientId => {
                    const p = room.presence[clientId];
                    if (p.playerOrb && updatedOrbs[p.playerOrb.id].state === 'closed') {
                        updatedOrbs[p.playerOrb.id].state = 'player-selected-hidden';
                        hasChanges = true;
                    }
                });
                if(hasChanges){
                    room.updateRoomState({ currentState: 'ELIMINATE', orbs: updatedOrbs });
                }
            }
        }

        renderUI();
    });

    room.onmessage = (event) => {
        const { data } = event;
        if (data.type === 'orb_elimination_start') {
            game.handleOrbElimination(data, room);
        }
    };

    if (!room.roomState || Object.keys(room.roomState).length === 0) {
        room.updateRoomState(getInitialGameState());
    } else {
        renderUI();
    }
    if (!room.presence[room.clientId]) {
        room.updatePresence({ status: 'waiting' });
    }
}

main();