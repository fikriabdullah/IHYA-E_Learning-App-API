const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
const quiz = express.Router();
app.use(cors({ origin: true }));

const db = admin.firestore();

quiz.post('/addTextQuiz', (req, res) => { // tambah qustion 
    JSON = {question: req.body.question, opt1: req.body.opt1, opt2: req.body.opt2,
    opt3: req.body.opt3, opt4: req.body.opt4, audioUrl:req.body.audioUrl, imgUrl: req.body.imgUrl, keyAnswer: req.body.keyAnswer}
        try {
          db.collection('/'+ req.body.bab +'/').doc('/'+ req.body.QNumber +'/')
              .create(JSON);
          return res.status(200).send();
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
  });  

  quiz.get('/fetchBabList', (req, res)=>{
      (async()=>{
          try{
              let query = db.collection('/'+'quiz'+'/');
              let response = []
              await query.get().then(querySnapshot=>{
                  let docs = querySnapshot.docs;
                  for(let doc of docs) {
                      const selectedItem = {
                        id : doc.id
                      };
                      response.push(selectedItem);
                  }
              });
              console.log(response.length)
              return res.status(200).send(response)
          }catch(error){
            console.log(error);
            return res(500).send(error);
          }
      })();
  });

  quiz.get('/readQuestion/:bab', (req, res) => { //read all question in 1 bab
    (async () => {
        try {
            let query = db.collection('/'+'quiz'+'/').doc('/'+req.params.bab+'/').collection('/'+req.params.bab+'/');
            let response = [];
            await query.get().then(querySnapshot => {
            let docs = querySnapshot.docs;
            for (let doc of docs) {
                const selectedItem = {
                    QNumber: doc.id,
                    question: doc.data().question,
                    opt1 : doc.data().opt1,
                    opt2 : doc.data().opt2,
                    opt3 : doc.data().opt3,
                    opt4 : doc.data().opt4,
                    keyAnswer : doc.data().crAnswer,
                    imgUrl : doc.data().imgDwnldUrl,
                    audioUrl: doc.data().audioDwnldUrl
                };
                response.push(selectedItem);
            }
            });
            console.log(response.length);
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

    quiz.get('/readOneQ/:bab/:QNumber', (req, res) => { //read one question from bab manapun
      (async () => {
          try {
              const document = db.collection('/'+'quiz'+'/').doc('/'+req.params.bab+'/').collection('/'+req.params.bab+'/').doc('/'+req.params.QNumber+'/');
              let item = await document.get();
              let response = item.data();
              return res.status(200).send(response);
          } catch (error) {
              console.log(error);
              return res.status(500).send(error);
          }
          })();
      });

module.exports = quiz;


