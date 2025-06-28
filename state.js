export function getInitialGameState() {
    return {
        currentState: 'WAITING', // WAITING, CHOOSE_ORB, ELIMINATE, REVEAL_ORB, OFFER, FINAL, END
        isMultiplayer: true,
        orbs: {},
        openedOrbsCount: 0,
        eliminationRounds: [5, 5, 5, 5, 5],
        roundEliminationCount: 0,
        currentOffer: null,
        lastRevealedContent: null,
        dollarValues: [],
        remainingValues: [],
        turnOrder: [],
        currentPlayerId: null,
        gameSeed: Math.random(),
        gameStartedBy: null,
    };
}