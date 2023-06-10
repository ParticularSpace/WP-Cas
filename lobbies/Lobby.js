class Lobby {
    constructor(id) {
        this.id = id;
        this.players = [];
        this.spectators = [];
    }

    addPlayer(player) {
        if (this.players.length < 7) {
            this.players.push(player);
        } else {
            this.spectators.push(player);
        }
    }

    removePlayer(playerId) {
        this.players = this.players.filter(player => player.id !== playerId);
        this.spectators = this.spectators.filter(player => player.id !== playerId);
    }

    getPlayers() {
        return this.players;
    }

    getSpectators() {
        return this.spectators;
    }
}

module.exports = Lobby;
