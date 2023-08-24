export const websocket = () => {
    let ws;
    let log = "";
// Initialize the WebSocket connection
const initWebSocket = () => {
  ws = new WebSocket('wss://212.227.78.96:8443', {
  rejectUnauthorized: false
});

  ws.addEventListener("open", (event) => {
    log += "WebSocket is open now.\n";
  });

  ws.addEventListener("message", (event) => {
    log += `Received: ${event.data}\n`;
    console.log(event.data);
  });

  ws.addEventListener("close", (event) => {
    log += "WebSocket is closed now.\n";
  });

  ws.addEventListener("error", (event) => {
    log += `WebSocket Error: ${event.message}\n`;
  });
};
const sendMessage = (message) => {
  if (!(ws)) throw new Error("No WebSocket connection");
  ws.send(message);
  log += `Sent: ${message}\n`;
  message = "";
};

return {
    sendMessage,
    initWebSocket
};
};