"use strict";
const app = require("./services/server");

setImmediate(async () => await app.start());

process.on("exit", async () => await app.stop());
process.on("SIGINT", async () => await app.stop());
