const Lobby = require('./Lobby');

class LobbyManager {
    constructor() {
        this.lobbies = {};
    }

    createLobby(lobbyId) {
        const lobby = new Lobby(lobbyId);
        this.lobbies[lobbyId] = lobby;
        return lobby;
    }

    getLobby(lobbyId) {
        return this.lobbies[lobbyId];
    }

    removeLobby(lobbyId) {
        delete this.lobbies[lobbyId];
    }

    addPlayerToLobby(lobbyId, player) {
        let lobby = this.getLobby(lobbyId);
        if (!lobby) {
            lobby = this.createLobby(lobbyId);
        }
        lobby.addPlayer(player);
    }

    removePlayerFromLobby(lobbyId, playerId) {
        const lobby = this.getLobby(lobbyId);
        if (lobby) {
            lobby.removePlayer(playerId);
            if (lobby.getPlayers().length === 0 && lobby.getSpectators().length === 0) {
                this.removeLobby(lobbyId);
            }
        }
    }
}

module.exports = LobbyManager;
