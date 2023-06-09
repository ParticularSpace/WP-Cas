const WebSocket = require('ws');

module.exports = function setupWebSocketServer(server) {
  console.log('Starting WebSocket server');

  // Create a WebSocket server
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
      const data = JSON.parse(message);
      switch (data.type) {
        case 'greeting':
          console.log(data.content);  // Should log 'Hello Server!'
          break;
        case 'join':
          // Handle a player joining the game
          break;
        case 'move':
          // Handle a player making a move
          break;
        case 'leave':
          // Handle a player leaving the game
          break;
        default:
          console.error(`Received unknown message type: ${data.type}`);
      }
    });

    // Handle when a client closes the connection
    ws.on('close', () => {
      console.log('Client disconnected');
      // Here you can handle any cleanup that needs to happen when a client disconnects
    });

    ws.send(JSON.stringify({ type: 'welcome', message: 'Hello Client!' }));
  });
};
