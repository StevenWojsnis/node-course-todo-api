const {ObjectID} = require('mongodb');

var {mongoose} = require('./../server/db/mongoose');
var {Todo} = require('./../server/models/todo');
var {User} = require('./../server/models/user');

var userID = '596ae66356d63f551f0f8dbc';

// var id = '5974d31fd722a86cea83bd4f11';

// if(!ObjectID.isValid(id)){
//   console.log('ID is not valid');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//   if(!todo){
//     return console.log('ID not found');
//   }
//   console.log('Todo By ID', todo);
// }).catch((err) => {
//   console.log(err);
// });

User.findById(userID).then((user) => {
  if(!user){
    return console.log('User not found');
  }

  console.log('User by ID: ', user);

}).catch((err) => {
  console.log(err);
});
