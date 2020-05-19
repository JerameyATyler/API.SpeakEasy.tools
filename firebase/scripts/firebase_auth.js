const fs = require('fs');
const path = require('path');
const firebase = require('firebase');

const firebaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-config.json'), {encoding: 'utf-8'}));

if (process.argv.length < 4) {
  console.log('Usage: node firebase_auth.js <email> <password');
  process.exit(0);
}
firebase.initializeApp(firebaseConfig);

console.log(`Getting token for ${process.argv[2]}...`)
console.log();

firebase.auth().signInWithEmailAndPassword(process.argv[2], process.argv[3]).then((cred) => {
  //console.log(cred);
  firebase.auth().currentUser.getIdToken(true).then((token) => {
    console.log('Token:');
    console.log();
    console.log(token);
    console.log();
  });
});
