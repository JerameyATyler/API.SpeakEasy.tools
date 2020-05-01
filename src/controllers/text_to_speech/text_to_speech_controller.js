"use strict";
const { reqSpeech } = require("../../repositories/text_to_speech_repository");

const getSpeech = async (req, res) => {
  console.log("getSpeech hit");
  const textData = {
    text: req.body.text,
  }

  // TODO Validate Text Input


  // Text to Speech
  try {
    const speechReceived = await reqSpeech(textData);
    res.status(200).json({ success: true, speech: speechReceived });
  }
  catch (error) {
    res.status(500).json({ success: false, err: "Error text to speech" })
  }
}
module.exports = {getSpeech}