import * as schema from "@colyseus/schema";

export class gameState extends schema.Schema {
  constructor() {
    super();
    this.mySynchronizedProperty = "Hello world";
  }
}

schema.defineTypes(gameState, {
  mySynchronizedProperty: "string",
});
