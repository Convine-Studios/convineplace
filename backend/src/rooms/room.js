import { Room } from "@colyseus/core";
import { gameState } from "./schema/gameState.js";

export class room extends Room {
  maxClients = 99;

  onCreate(options) {
    this.setState(new gameState());

    this.onMessage("message", (client, message) => {
      console.log("game received message from", client.sessionId, ":", message);
      client.send("message", message);
    });

    this.onMessage("pixel", (client, message) => {
      console.log("game received message from", client.sessionId, ":", message);
      this.broadcast("pixel", message);
      client.send("pixel", message);
    });
  }

  onJoin(client, options) {
    console.log(client.sessionId, "joined!");
  }

  onLeave(client, consented) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
