const mongoose = require('mongoose');
 
const accountSchema = mongoose.Schema({
    accountName: { type: String, required: true },
    event: { type: Array, required: false },
    phoneNumber: {type:Number, required:true}
  }, {
    timestamps: { type: Date, createdAt: 'created_at' }
  }
);
 
 
const Account = mongoose.model('User', accountSchema);
 
module.exports = Account;