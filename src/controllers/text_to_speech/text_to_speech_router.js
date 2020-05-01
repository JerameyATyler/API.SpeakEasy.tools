"use strict";
const express = require("express");
const cors = require("cors");

// Import controller functions

const { getSpeech } = require("./text_to_speech_controller");
const t2sRouter = express.Router();

/**
 * @todo Google API Key Handling
 */
t2sRouter.options("*", cors());
t2sRouter.get("/:text", getSpeech);

exports.t2sRouter = t2sRouter;
