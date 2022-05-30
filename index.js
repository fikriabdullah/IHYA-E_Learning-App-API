const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));
const portNum = process.env.PORT;

var serviceAccount = require("./islam-digital-ecosystem-firebase-adminsdk-te8fh-198d491f78.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://islam-digital-ecosystem.firebaseio.com"
});
const db = admin.firestore();

const QuizRoute = require('./Quiz');
app.use('/Quiz', QuizRoute);

exports.app = functions.https.onRequest(app);
app.listen(portNum || 8000, ()=>{
  console.log('Local Server Started On Port 8000');
  console.log(`Heroku Start On Port ${portNum}`);
});
