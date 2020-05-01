"use strict";

const reqSpeech = async (textData) => {
    const text = textData.text;
    
    // TODO Google API Handling
    result = null;

    // Output
    if (result == null){ 
        console.error(createResult);
        throw Error("Google Text To Speech API FAILED");
    }
    return result;
  }

module.exports = {reqSpeech }