const mongoose = require('mongoose');
 
const accountSchema = mongoose.Schema({
    accountName: { type: String, required: true },
    events: { type: Array, required: false },
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