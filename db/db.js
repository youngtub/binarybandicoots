const mongoose = require('mongoose');
const MongoClient = require('mongodb')

mongoose.connect(`mongodb://testuser:testtest@ds135534.mlab.com:35534/binarybandicoots`, (err, win) => {
  if (err) {
    console.error(`Error connecting: ${err}`)
  } else {
    console.log(`(>'.')> Database Connected <('.'<)`) 
  }
});

var db = mongoose.connection;

module.exports = db;