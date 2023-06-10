class Lobby {
    constructor(id) {
      this.id = id;
      this.players = [];
      this.spectators = [];
      this.gameState = null;
    }
  
    addPlayer(player) {
      this.players.push(player);
    }
  
    removePlayer(player) {
      this.players = this.players.filter(p => p.id !== player.id);
    }
  
    // Add similar methods for spectators
  }
  
  module.exports = Lobby;
  