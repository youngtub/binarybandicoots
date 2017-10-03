const mongoose = require('mongoose');
const MongoClient = require('mongodb');

mongoose.connect(`mongodb://c:stars@ds161164.mlab.com:61164/billeasy_cstars`, (err, win) => {
  if (err) {
    console.error(`Error connecting: ${err}`)
  } else {
    console.log(`(>'.')> Database Connected <('.'<)`)
  }
});

var db = mongoose.connection;

module.exports = db;
