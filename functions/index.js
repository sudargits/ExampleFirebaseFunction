var functions = require('firebase-functions');
const uuid = require('uuid');

var admin = require("firebase-admin");
// var serviceAccount = require("development-gits-firebase-adminsdk-kd7x5-891bf587bd.json");
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "development-gits",
    clientEmail: "firebase-adminsdk-kd7x5@development-gits.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDEp/jjNNKOd9Jc\ndxkxzssmeyVPOyfzIXbGF3GVIv1QO/S59US44WOMOi7s32pGQMbARW8fTgx2UIFP\nBGMseF/3Ak+AlkVPKHeAt3iLNmpGY2wfrhuZIqt9VF1nzkYkqNYrdFEk3iUN4y62\n7BuVeL6mGyHRttrLY/VGwuKozVifDdq3tBgksdd9gOCXTbySkeYT+HlG/Fl3z2uZ\nn1u0TLN2w9AyfQzTc6EigBxpSrBONuneH66/z84lbcjdQpgbvRtthhaXQeJOWYkO\nhzVlswj4N+g+pz76aACBlsnMHJH+COm6aKiI7AMwuIkGynDJDYF05oU9UOII4X8O\nNgtIQXB3AgMBAAECggEALWBcy4BavUjknzVT+Owwb/amSzvpIe6sy1SJftIOBT9w\nXqA7dTV8lNSwEzQR/5fexGrBE0YdFgfJboQiphY4fnRoB9GkuHkr6eVrySOLLiau\nwjiYYaNgUpDu5I7yHG9gy7IRLyKbBjNPiiG806aCxy0nho5cueWcqPE6/5wyQLC3\n5aOWE1kVPwDUMqAMqHDLixF+wL0wBrsd6wYUHJ8EmyvXsMYToWoZ2rO/ilenUaWw\nCs29rY2w5AOO3Sa557DruBaaeiHP2gYY5TKtAhDixSFD6LcsIeDn0NMBar/RpZ8g\nlfk3vyWJlsxSP9eQyijYA0FhiQ/nUqVaq8pQT7e2cQKBgQDwdxnaSr7jomanOcc1\n6d8qnVa5UTTI/SXpUz3W+k2WVu+SgBbLVqeeEpRtyENAPsCnvC0wJ7zBbla/wAF5\nGU1X9totHKbX/2XZx9d4UjCAKi8ybnsWzdJ5kGed/lhbDG4eXst1RPfJxdJ/0h6F\niEgojIgnuM2GrriuYA/H4RItPQKBgQDRXFdGgNC2TPcpKBfsmNP7JwxNyX6NvO/J\nec+sS25iU6hytT9Ynv99Ce87rgKiuUbCyNY3B7+mZsV0+UUzNzUHq5YHvEkAsg4U\nDKCZv/NEaVcBjcI8Ie9kLLFRJztr+YxVYMwzKF8z9fRoaVuQNq/64el5aLmokqgq\nnxmQmUKXwwKBgQDTCAMlQxGxnnWubpN4qi3TLU/NxQmpFhkuYoJT50kuFk+b51OZ\n0gu6Ox4OFoGGoUvcKNYTe9w4eYgiMfRY/a6V8yrYClwWFaqh7LMZgi/UWrEe9jyJ\n78m2K9fznSKXjRobByBRY1x+tGCfEpz8nXSOOX7INXQRrcagKefPh6O3FQKBgGbH\n/JjCOLSmyFhONKCUzszn+KRfnV+cN+Qjhw7A4WooQ/Q8guLQ/AC41dfor6aPauvJ\niVDu3umkXp/0mEJygfhIBpm5l+VdhIfXQyj4EUeup2Y93/OBfXMiddKvff6ePoTT\nxqv+z+5Eez6fKrJ8Bp0WN3bBMRRPG3wBK53Pf9/dAoGBAIerYj/5yMTB5F3l+DbJ\nHiLwxcuLuD4GWAwk9P5A0mZoKx6z8pOYd5I/QQHkWf+fLKn/oVvQhtvVYPgEO4zC\nQEg+oWQIBfr7SY02rgwJWOUiusUi/ocRwiYFjWo5se20YvrXA1xJvTUsFVgBvkMu\nfKWYzwKbi/IVN08SeBxGPufZ\n-----END PRIVATE KEY-----\n"
  }),
  databaseURL: "https://development-gits.firebaseio.com/"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();


// // Start writing Firebase Functions
// // https://firebase.google.com/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
})
// Return a newly generated UUID in the HTTP response.
exports.getUuid = functions.https.onRequest((req, res) => {
  res.send(uuid.v4());
});

/**
 * Check jika ada perubahan data database realtime
 */
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onWrite(event => {
      const original = event.data.val();
      const uppercase = original.toUpperCase();
      return event.data.ref.parent.child('uppercase').set(uppercase);
});

/**
 * Check jika data sudah ada sebelumnnya database realtime
 */
exports.makeUppercaseWithBefore = functions.database.ref('/messages/{pushId}/before')
    .onWrite(event => {
      if (event.data.previous.exists()) {
        return;
      }
      if (!event.data.exists()) {
        return;
      }
      const original = event.data.val();
      console.log('Uppercasing', event.params.pushId, original);
      const uppercase = original.toUpperCase();
      return event.data.ref.parent.child('after').set(uppercase);
});

exports.getMoview = functions.https.onRequest((req,res) => {
  var ref = db.ref("moview/");
  var mov = [{
    name : 'Spiderman',
    publisher : 'Sony'
  },{
    name : 'Spiderman',
    publisher : 'Sony'
  },];
  ref.set(mov).then(() => {
    console.log('Write succeeded!');
  });

  res.status(200).send({name:'sudar'});
});

exports.hello = functions.database.ref('/hello').onWrite(event => {
  // set() returns a Promise. We keep the function alive by returning it.
  return event.data.ref.set('world!').then(() => {
    console.log('Write succeeded!');
  });
});