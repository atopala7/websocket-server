// Connect to the WebSocket server, and when the connection is established, send messages to the server and display messages received from the server.
connectToServer().then((socket) => {
  // When the client receives a message, create a new list item and append it to the (first and only) list in the DOM
  socket.onmessage = ({ data }) => {
    console.log(data);
    const listElement = document.createElement("li");
    listElement.textContent = data;
    document.querySelector("ul").appendChild(listElement);
  };

  // When the form is submitted (either via the button or by pressing the Enter key while the input field is in focus), send the message to the server
  document.querySelector("form").addEventListener("submit", (e) => {
    // Prevent the default behavior of the form so that the page doesn't reload
    e.preventDefault();
    const input = document.querySelector("input");
    if (input.value) {
      // Send the message to the server
      socket.send(input.value);
      console.log(`Sent: ${input.value}`);

      // Clear the input field
      input.value = "";
    }
  });
});

/**
 * Connect to the server and return a Promise that resolves to the WebSocket
 * @returns {Promise<WebSocket>}
 */
async function connectToServer() {
  const PORT = 8080;
  // Create the WebSocket connection
  const socket = new WebSocket(`ws://localhost:${PORT}`);
  console.log(`WebSocket client starting on port ${PORT}....`);
  // Wait for the connection to be established
  return new Promise((resolve, reject) => {
    // Check every 100ms to see if the socket state is open
    // If it is, resolve the promise with the socket
    const timer = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        console.log("WebSocket client connected.");
        clearInterval(timer);
        resolve(socket);
      } else if (socket.readyState === WebSocket.CLOSED) {
        clearInterval(timer);
        reject(new Error("WebSocket client unable to connect."));
      }
    }, 100);
  });
}
