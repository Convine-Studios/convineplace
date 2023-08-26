const WebSocket = require("ws");

const MAX_CONNECTIONS = 5; // Adjust the number of connections you'd like to test
let connectedCount = 0;
const testMessage = "broadcast this message";
let receivedCount = 0;

const connectWebSocket = (clientNumber) => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket('wss://127.0.0.1:8080', {
      rejectUnauthorized: false
    });

    ws.on("open", () => {
      connectedCount++;
      console.log(`Client ${clientNumber} connected. Total connected: ${connectedCount}`);

      // Send a test message from the first client
      if (connectedCount === 1) {
        console.log("Sending test message from client 1.");
        ws.send(testMessage);
      }
    });

    ws.on("message", (data) => {
      console.log(`Received message on client ${clientNumber}: ${data}`);
      if (data === testMessage) {
        receivedCount++;
      }

      // Close the connection after receiving the message
      console.log(`Closing client ${clientNumber}`);
      ws.close();
    });

    ws.on("close", () => {
      console.log(`Client ${clientNumber} closed.`);
      resolve();
    });

    ws.on("error", (error) => {
      console.error(`WebSocket Error on client ${clientNumber}:`, error);
      reject(error);
    });
  });
};

const runTest = async () => {
  const promises = [];

  for (let i = 1; i <= MAX_CONNECTIONS; i++) {
    promises.push(connectWebSocket(i));
  }

  await Promise.all(promises);

  if (receivedCount === MAX_CONNECTIONS) {
    console.log(`Test passed: All ${MAX_CONNECTIONS} clients received the broadcasted message.`);
  } else {
    console.log(`Test failed: Only ${receivedCount} out of ${MAX_CONNECTIONS} clients received the broadcasted message.`);
  }
};

runTest().catch((error) => {
  console.error("Test failed:", error);
});
