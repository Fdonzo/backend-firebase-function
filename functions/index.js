require("dotenv").config();
const {sendMail} = require("./email-prep.js");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
/* exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});*/

/*
exports.databaseRead = functions.https.onRequest(async (request, response)=>{
  const db = admin.firestore();
  let currentData;
  const getSnapshots = await db.collection("email").get();
  const snapshots = getSnapshots.docs;
  console.log("my data", snapshots);
  try {
    if (!snapshots.exists) {
      console.log("no data");
    } else {
      currentData= snapshots.map((eachItem)=>{
        return {
          "email": eachItem.email,
          "date": eachItem.date,
          "name": eachItem.name,
        };
      });
      console.log(currentData);
      response.send(currentData);

      return "";
    }
  } catch (error) {
    response.send(error);
  }
});

*/
exports.emailNotificationSend = functions.firestore.document("email/{emailID}")
    .onCreate( async (snap, context)=>{
      try {
        const newDate = snap.data().date;
        const newName = snap.data().name;
        const newEmailID= snap.data().email;
        const newEmailDataSend ={};
        const db = admin.firestore();
        const getSnapshots = db.collection("email");
        const snapshots = await getSnapshots.get();
        console.log("my data", snapshots);
        snapshots.forEach((snapshot)=>{
          const {name, email, date} = snapshot.data();
          console.log("key document data", name, email, date);
          if ((newEmailID===email)&&(newDate===date)&&(newName===name)) {
            newEmailDataSend["name"]=name;
            newEmailDataSend["email"]=email;
            newEmailDataSend["date"]=date;
          }
        });

        console.log("start");
        /*
        snapshots.map((snapshot)=>{
          const {name, email, date} = snapshot.data();
          if ((newEmailID===email)&&(newDate===date)&&(newName===name)) {
            return {"email": email,
              "date": date,
              "name": name};
          } else {
            return "no data";
          }
        });
        */
        console.log("middle");
        console.log(newEmailDataSend);
        const mailOptions = {
          from: newEmailDataSend.email,
          to: process.env.EMAIL,
          subject: `New Message from ${newEmailDataSend.email}`,
          text: newEmailDataSend.name,
          html: `<p>The following message below was received on 
            ${newEmailDataSend.date}:</p>
            <p>${newEmailDataSend.email}</p>`,
        };
        console.log("upper middle");

        sendMail(mailOptions)
            .then((result) =>console.log("email sent", result))
            .catch((error) => console.log("error_name", error.message));

        console.log("upper middle two");
        return newEmailDataSend;
      } catch (error) {
        console.log("error", error.message);
        return error;
      }
    });


