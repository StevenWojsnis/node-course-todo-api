const {ObjectID} = require('mongodb');

var {mongoose} = require('./../server/db/mongoose');
var {Todo} = require('./../server/models/todo');
var {User} = require('./../server/models/user');

// Todo.remove({}).then((results) => {
//   console.log(results);
// });



Todo.findByIdAndRemove('597ce66e3daaab78f24e553c').then((result) => {
  console.log(result);
});
