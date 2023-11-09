/**
 * This is a simple example of a WebSocket server.
 */
const WebSocket = require("ws");

const { v4: uuidv4 } = require("uuid");

// Set a port for the server to listen on
// If the environment variable PORT exists, use that; otherwise, use 8080
const PORT = process.env.PORT || 8080;

// Create the WebSocket server
const server = new WebSocket.Server({ port: PORT });
console.log(`WebSocket server started on port ${PORT}`);

// Create a map to store clients
const clients = new Map();

server.on("connection", (socket) => {
  // Generate a unique ID for this client
  const id = uuidv4();
  clients.set(socket, id);
  console.log(`Client ${id} connected.`);

  // When a client sends a message, log it and send it to the other clients
  socket.on("message", (message) => {
    console.log(`Received: ${message} from ${id}.`);

    // Spread the clients map and iterate over the keys (sockets)
    [...clients.keys()].forEach((client) => {
      // If the client is not the one that sent the message, send it to them
      if (client !== socket) {
        client.send(`${id} sent: ${message}`);
      }
    });
  });

  // When a client disconnects, remove it from the clients map
  socket.on("close", () => {
    console.log(`Client ${id} disconnected.`);
  });
});
