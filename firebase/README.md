# speakeasy-firebase-functions

## Configuration

To run this, it depends on setting up a JSON file that contains credentials for a service account
to use with GCloud that has been activated with Speech API, Text-to-Speech API, and Firebase.

For how to get that JSON file, see <https://cloud.google.com/speech-to-text/docs/quickstart-client-libraries#before-you-begin>
and where it asks you to store the JSON file and update an environment variable, just save the file as `gcloud.json` into
the `functions/` directory.

## Usage

To utilize any of the below endpoints, you must include an authorization header with the value set to `Bearer <auth_token>`.
This token should be gotten by doing `firebase.auth().currentUser.getIdToken(true)` where the returned Promise contains the token.

### /tts

This endpoint is used for using the Google Text-to-Speech platform to transcribe text to audio data.

Parameters:

| name | type   | description
|------|--------|--------------------------|
| text | string | text to turn into speech |

### /stt

This endpoint is used to convert raw audio data into a transcript. It is expected
that you use the following configuration for receiving the audio data from the source:

* encoding: LINEAR16,
* sampleRateHertz: 16000,
* languageCode: en-US

Parameters:

| name  | type   | description                                               |
|-------|--------|-----------------------------------------------------------|
| audio | string | base64 encoded string representation of audio information |

## Development

### Setup

To use the repo, it is suggested to

```bash
npm install -g firebase-tools
```

You will then need to log into firebase:

```bash
firebase login
```

and then get your list of projects:

```bash
firebase projects
```

and given the ID of the right project, do:

```bash
firebase use --add <project_id>
```

### Testing

Move into the `functions/` directory and run the following:

```bash
npm run serve
```

### Deploying

```bash
firebase deploy --only functions
```
