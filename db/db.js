const mongoose = require('mongoose');
const MongoClient = require('mongodb')

mongoose.connect(`mongodb://testuser:testtest@ds139964.mlab.com:39964/binarybandicoots`, (err, win) => {
  if (err) {
    console.error(`Error connecting: ${err}`)
  } else {
    console.log(`(>'.')> Database Connected <('.'<)`) 
  }
});

var db = mongoose.connection;

module.exports = db;