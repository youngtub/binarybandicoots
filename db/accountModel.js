const mongoose = require('mongoose');
 
const accountSchema = mongoose.Schema({
    phoneNumber: {type:Number, required:true}
  }, {
    timestamps: { type: Date, createdAt: 'created_at' }
  }
);
 
const Account = mongoose.model('Account', accountSchema);

Account.create({
  phoneNumber: process.env.EXAMPLE
})
 
module.exports = Account;