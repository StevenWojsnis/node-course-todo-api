var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/TodoApp', {useMongoClient: true});
//mongoose.connect(`mongodb://${process.env.dbuser}:${process.env.dbpassword}@ds121483.mlab.com:21483/sandbox_practice`, {useMongoClient: true});
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});
module.exports = {
  mongoose
};
