const Lobby = require('./Lobby');

class LobbyManager {
  constructor() {
    this.lobbies = [];
  }

  createLobby() {
    const id = this.lobbies.length + 1;  // Generate a unique id for the lobby
    const lobby = new Lobby(id);
    this.lobbies.push(lobby);
    return lobby;
  }

  getLobby(id) {
    return this.lobbies.find(lobby => lobby.id === id);
  }

  // Add more methods as needed
}

module.exports = new LobbyManager();
