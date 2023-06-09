// Create a WebSocket connection to the server
const Socket = new WebSocket('ws://localhost:3001');

// When the connection is open, send some data to the server
Socket.addEventListener('open', (event) => {
    let greetingMessage = {
        type: 'greeting',
        content: 'Hello Server!'
    };
    Socket.send(JSON.stringify(greetingMessage));
});

// Log errors
Socket.addEventListener('error', (event) => {
    console.log('WebSocket error: ', event);
});

// Log messages from the server
Socket.addEventListener('message', (event) => {
    console.log('Server says: ', event.data);
});
