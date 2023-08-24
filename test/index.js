const WebSocket = require("ws");

const MAX_CONNECTIONS = 1000;
let connectedCount = 0;
const startTime = Date.now();

const connectWebSocket = () => {
  return new Promise((resolve) => {
    const ws = new WebSocket("ws://127.0.0.1:8080");

    ws.on("open", () => {
      connectedCount++;
      ws.close(); // Close the WebSocket connection
    });

    ws.on("close", () => {
      resolve(); // Resolve the promise only after connection is closed
    });

    ws.on("error", (error) => {
      console.error("WebSocket Error:", error);
      resolve(); // resolve anyway to continue the test
    });
  });
};

const runTest = async () => {
  const promises = [];

  for (let i = 0; i < MAX_CONNECTIONS; i++) {
    promises.push(connectWebSocket());
  }

  await Promise.all(promises);

  const endTime = Date.now();
  const timeTaken = endTime - startTime;

  console.log(
    `Connected and closed ${connectedCount} websockets in ${timeTaken} ms`
  );
};

runTest().catch((error) => {
  console.error("Test failed:", error);
});
