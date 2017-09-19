const mongoose = require('mongoose');
const MongoClient = require('mongodb')

mongoose.connect(`mongodb://testuser:testtest@ds135534.mlab.com:35534/binarybandicoots`, (err, win) => {
<<<<<<< HEAD
  if (err) {
    console.error(`Error connecting: ${err}`)
  } else {
    console.log(`(>'.')> Database Connected <('.'<)`) 
  }
=======
	if(err){
		console.error(`Error connecting: ${err}`)
	} else {
		console.log(`(>'.')> Database Connected <('.'<)`) 
	}
>>>>>>> db
});

var db = mongoose.connection;

module.exports = db;