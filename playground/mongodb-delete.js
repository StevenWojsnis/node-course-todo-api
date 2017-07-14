// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB client');
  }

  console.log('Connected to MongoDB server');

  //deleteMany
  // db.collection('Todos').deleteMany({
  //   text: 'Eat lunch'
  // }).then((result) => {
  //   console.log(result);
  // });

  //deleteOne
  // db.collection('Todos').deleteOne({
  //   text: 'Eat lunch'
  // }).then((result) => {
  //   console.log(result);
  // });

  //findOneAndDelete
  // db.collection('Todos').findOneAndDelete({
  //   completed: false
  // }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').deleteMany({
    name: 'Steven'
  });

  db.collection('Users').findOneAndDelete({
    _id: new ObjectID('5966e8a482fb2424ad1612e6')
  }).then((result) => {
    console.log(JSON.stringify(result,undefined,2));
  });

  //db.close();
});
