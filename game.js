class Game {
    constructor() {
        this.players = [];
        this.deck = [];
        this.currentPlayerIndex = 0;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(playerId) {
        this.players = this.players.filter(player => player.id !== playerId);
    }

    startNewRound() {
        this.deck = this.createDeck();
        this.shuffleDeck();
        this.dealInitialCards();
    }

    createDeck() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const deck = [];

        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value });
            }
        }

        return deck;
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealInitialCards() {
        for (let player of this.players) {
            player.hand = [this.deck.pop(), this.deck.pop()];
        }
    }

    dealCard(playerId) {
        const player = this.players.find(player => player.id === playerId);
        if (player) {
            player.hand.push(this.deck.pop());
        }
    }

    getPlayers() {
        return this.players;
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    getCurrentPlayerIndex() {
        return this.currentPlayerIndex;
    }

    setCurrentPlayerIndex(index) {
        this.currentPlayerIndex = index;
    }

    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    getDeck() {
        return this.deck;
    }

    setDeck(deck) {
        this.deck = deck;
    }

    getWinner() {
        let winner = null;
        let maxScore = 0;
    
        for (let player of this.players) {
            let score = this.calculateScore(player.hand);
            if (score > maxScore && score <= 21) {
                maxScore = score;
                winner = player;
            }
        }
    
        return winner;
    }
    

    broadcastGameState() {
        const gameState = this.serialize();
        for (let player of this.players) {
            player.ws.send(JSON.stringify({ type: 'gameState', gameState }));
        }
    }
    

    serialize() {
        return JSON.stringify(this);
    }
    

    deserialize(gameState) {
        const data = JSON.parse(gameState);
        this.players = data.players;
        this.deck = data.deck;
        this.currentPlayerIndex = data.currentPlayerIndex;
    }
    

    calculateScore(hand) {
        let score = 0;
        let aces = 0;
    
        for (let card of hand) {
            if (card.value === 'A') {
                aces += 1;
                score += 11;
            } else if (card.value === 'K' || card.value === 'Q' || card.value === 'J') {
                score += 10;
            } else {
                score += parseInt(card.value);
            }
        }
    
        while (score > 21 && aces > 0) {
            score -= 10;
            aces -= 1;
        }
    
        return score;
    }
    

    checkBust(player) {
        return this.calculateScore(player.hand) > 21;
    }
    

    endTurn() {
        this.nextPlayer();
        this.broadcastGameState();
    }
    

    endGame() {
        const winner = this.getWinner();
        this.broadcastGameState();
        this.resetGame();
    }
    

    resetGame() {
        this.players = [];
        this.deck = [];
        this.currentPlayerIndex = 0;
    }

    static createGameFromSerializedGame(serializedGame) {
        const game = new Game();
        game.deserialize(serializedGame);
        return game;
    }
    

    static createGameFromGameState(gameState) {
        const game = new Game();
        game.players = gameState.players;
        game.deck = gameState.deck;
        game.currentPlayerIndex = gameState.currentPlayerIndex;
        return game;
    }
    
}

module.exports = Game;
