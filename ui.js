import { html, render as litRender } from 'lit-html';
import { gsap } from 'gsap';
import { prizeAnimations, curseAnimations, rainConfetti, animateOrbsRandomFlash, animateChartRandomFlash } from './animations.js';
import { playSound, stopHoverSound } from './audio.js';

// Import screen modules
import { startScreen } from './screens/startScreen.js';
import { gameScreen } from './screens/gameScreen.js';
import { revealOrbScreen } from './screens/revealOrbScreen.js';
import { offerModal } from './screens/offerModal.js';
import { finalChoiceScreen } from './screens/finalChoiceScreen.js';
import { endScreen } from './screens/endScreen.js';

const gameContainer = document.getElementById('game-container');
const comparisonHostContainer = document.getElementById('comparison-host-container');
const hostPlaceholder = document.getElementById('host-placeholder');
const playerListContainer = document.getElementById('player-list-container');

// New array to hold animation timelines for the current screen
let currentScreenAnimations = [];

// Helper to format dollar amounts
export const formatMoney = (amount) => {
    if (typeof amount !== 'number') return amount;
    return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: amount < 1 && amount > 0 ? 2 : 0,
        maximumFractionDigits: 2,
    });
};

export const hostTemplate = (dialogue) => {
    // Render the host into its dedicated placeholder
    litRender(html`
        <div class="host-container">
            <img src="host.png" alt="Game Host" class="host-image">
            <div class="host-dialogue">${dialogue}</div>
        </div>
    `, hostPlaceholder);
};

export const updatePlayerList = (presence, peers, roomState) => {
    const players = Object.keys(peers).map(clientId => {
        const peer = peers[clientId];
        const p = presence[clientId] || {};
        const isCurrentTurn = roomState && roomState.currentPlayerId === clientId;

        let statusText = 'Joining...';
        let isOut = false;
        if (p.status) {
            switch(p.status) {
                case 'waiting': statusText = 'Ready!'; break;
                case 'picking_orb': statusText = 'Picking orb...'; break;
                case 'waiting_turn': statusText = 'Waiting...'; break;
                case 'making_offer_decision': statusText = 'Deciding...'; break;
                case 'took_deal': 
                    statusText = `Took deal!`; 
                    isOut = true;
                    break;
                case 'finished_game': 
                    statusText = 'Finished!'; 
                    isOut = true;
                    break;
                case 'playing': 
                    statusText = isCurrentTurn ? 'My Turn!' : 'Waiting...'; 
                    break;
            }
        }
        
        return html`
        <div class="player-info ${isCurrentTurn ? 'current-turn' : ''} ${isOut ? 'out' : ''}">
            <img src="${peer.avatarUrl}" alt="${peer.username}">
            <div class="player-name">${peer.username}</div>
            <div class="player-status">${statusText}</div>
        </div>
        `;
    });
    litRender(html`${players}`, playerListContainer);
};

export const clearHost = () => {
    hostPlaceholder.innerHTML = '';
};

// Wrapper around lit-html's render function
export const render = (templateResult, container) => {
    // Kill any existing animations before rendering new content
    currentScreenAnimations.forEach(tl => tl.kill());
    currentScreenAnimations = []; // Clear the array

    litRender(templateResult, container);
};

// Expose screen functions
export { startScreen, gameScreen, revealOrbScreen, offerModal, finalChoiceScreen, endScreen };

// Function to add a timeline to the currentScreenAnimations array
// This is used by screen modules to register their animations
export const addAnimationTimeline = (timeline) => {
    if (timeline) {
        currentScreenAnimations.push(timeline);
    }
};

export const animateEliminatedValue = (value, isCurse) => {
    // A small timeout ensures Lit-HTML has completed its render cycle and the 'eliminated' class is applied.
    setTimeout(() => {
        const valueBoardContainer = document.querySelector('.value-board-container');
        if (!valueBoardContainer) return;

        // Find the specific value-item that matches the value AND HAS THE 'eliminated' class
        const eliminatedValueItem = Array.from(valueBoardContainer.querySelectorAll('.value-item.eliminated'))
            .find(el => parseFloat(el.textContent.replace(/[^0-9.-]+/g,"")) === value);

        if (eliminatedValueItem) {
            const flashColor = isCurse ? 'var(--neon-pink)' : 'var(--neon-cyan)';
            
            // Temporarily override the eliminated styles to create a "flash"
            gsap.set(eliminatedValueItem, {
                backgroundColor: flashColor,
                color: 'var(--dark-bg)', // Text color for the flash
                scale: 1.1,
                opacity: 1
            });

            // Animate from the flash state to the desired eliminated state
            gsap.to(eliminatedValueItem, {
                backgroundColor: '#222', // Final eliminated background
                color: '#555',           // Final eliminated text color
                scale: 1,
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
                delay: 0.1 // Short delay after set to make the flash visible
            });

            // Add a subtle bounce/jiggle for emphasis
            gsap.fromTo(eliminatedValueItem,
                { y: -5 },
                { y: 0, duration: 0.3, ease: 'back.out(2)', delay: 0.15 }
            );
        }
    }, 50); // Small timeout to ensure DOM update
};