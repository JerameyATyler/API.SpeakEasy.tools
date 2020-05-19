const { join } = require('path');
const express = require('express');

const functions = require('firebase-functions');
const admin = require('firebase-admin');

const { SpeechClient } = require('@google-cloud/speech');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');

const app = express();

gloudKeyfile = join(__dirname, 'gcloud.json');

const ttsClient = new TextToSpeechClient({
  keyFilename: gloudKeyfile,
});

const speechClient = new SpeechClient({
  keyFilename: gloudKeyfile,
});

admin.initializeApp({
  keyFilename: gloudKeyfile,
});

async function authenticate(req, res, next) {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    res.status(403).send('Unauthorized');
    return;
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  try {
    await admin.auth().verifyIdToken(idToken);
    //req.user = decodedIdToken;
    next();
    return;
  } catch(e) {
    res.status(403).send('Unauthorized');
    return;
  }
}

app.use(authenticate);

app.post('/tts', async (req, res) => {
  const text = req.body.text;

  // Construct the request
  const request = {
    input: {
      text: text
    },
    // Select the language and SSML voice gender (optional)
    voice: {
      languageCode: 'en-US',
      ssmlGender: 'NEUTRAL'
    },
    // select the type of audio encoding
    audioConfig: {
      audioEncoding: 'MP3'
    },
  };

  // Performs the text-to-speech request
  const [response] = await ttsClient.synthesizeSpeech(request);
  request.audioContent = JSON.stringify(response.audioContent).data;
  res.json({
    results: response.audioContent,
    request: request,
  });
});

app.post('/stt', async (req, res) => {
  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: req.body.audio,
  };
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  const [response] = await speechClient.recognize(request);
  res.json({
    results: response.results,
    request: config
  });
});

exports.app = functions.https.onRequest(app);
