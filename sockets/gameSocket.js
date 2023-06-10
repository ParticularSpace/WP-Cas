const WebSocket = require('ws');

module.exports = function setupWebSocketServer(server) {
  console.log('Starting WebSocket server');

  // Create a WebSocket server
  const wss = new WebSocket.Server({ server });

  // Define tables object
  const tables = {};

  // Define lobbies object
  const lobbies = {};

  // Define broadcastToLobby function
  function broadcastToLobby(lobby, message) {
    let clients = lobbies[lobby];
    if (clients) {
      clients.forEach(client => {
        client.send(JSON.stringify(message));
      });
    }
  }

  wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
      const data = JSON.parse(message);
      switch (data.type) {
        case 'greeting':
          console.log(data.content);  // Should log 'Hello Server!'
          break;
        case 'joinTable':
          // Handle joining a table
          const tableId = data.tableId;
          if (!tables[tableId]) {
            // If the table doesn't exist, create it
            tables[tableId] = [];
          }
          // Add the client to the table
          tables[tableId].push(ws);
          console.log(`Client joined table ${tableId}`);
          break;
        case 'leaveTable':
          // Handle leaving a table
          tableId = data.tableId;
          if (tables[tableId]) {
            // Remove the client from the table
            tables[tableId] = tables[tableId].filter(client => client !== ws);
            console.log(`Client left table ${tableId}`);
          }
          break;
        case 'startGame':
          // Handle starting the game
          console.log('Game started');
          break;
        case 'stay':
          // Handle the player staying
          console.log('Player stays');
          break;
        case 'hit':
          // Handle the player hitting
          console.log('Player hits');
          break;
        case 'gameUpdate':
          // Handle game updates
          console.log(`Game state: ${JSON.stringify(data.gameState)}`);
          break;
        case 'bet':
          // Handle the player betting
          console.log('Player bets');
          break;
        case 'double':
          // Handle the player doubling down
          console.log('Player doubles down');
          break;
        case 'split':
          // Handle the player splitting
          console.log('Player splits');
          break;
        case 'insurance':
          // Handle the player buying insurance
          console.log('Player buys insurance');
          break;
        case 'chat':
          // Handle chat messages
          console.log(`Received chat message: ${data.message}`);
          break;
        case 'joinLobby':
          // Add the client to the lobby
          let lobby = lobbies[data.lobby] || { players: [], spectators: [] };
          if (lobby.players.length < 7) {
            lobby.players.push(ws);
          } else {
            lobby.spectators.push(ws);
          }
          lobbies[data.lobby] = lobby;
          console.log(`Lobby ${data.lobby} has ${lobby.players.length} players and ${lobby.spectators.length} spectators`)

          // Broadcast the updated lobby to all clients in the lobby
          broadcastToLobby(data.lobby, {
            type: 'lobbyUpdate',
            players: lobby.players.length,
            spectators: lobby.spectators.length
          });
          break;
        case 'leaveLobby':
          // Remove the client from the lobby
          lobby = lobbies[data.lobby];
          if (lobby) {
            // Remove the client from players and spectators
            lobby.players = lobby.players.filter(client => client !== ws);
            lobby.spectators = lobby.spectators.filter(client => client !== ws);

            // Broadcast the updated lobby to all clients in the lobby
            broadcastToLobby(data.lobby, {
              type: 'lobbyUpdate',
              players: lobby.players.length,
              spectators: lobby.spectators.length
            });
          }
          break;
        default:
          console.error(`Received unknown message type: ${data.type}`);
      }
    });

    // Handle when a client closes the connection
    ws.on('close', () => {
      console.log('Client disconnected');
      // Remove the client from all tables they're in
      for (let tableId in tables) {
        tables[tableId] = tables[tableId].filter(client => client !== ws);
      }
    });

    ws.send(JSON.stringify({ type: 'welcome', message: 'Hello Client!' }));
  });
};
