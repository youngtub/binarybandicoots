const mongoose = require('mongoose');
 
const accountSchema = mongoose.Schema({
    events: { type: Array, required: false },
    phoneNumber: {type: String, required:true}
  }, {
    timestamps: { type: Date, createdAt: 'created_at' }
  }
);
 
const Account = mongoose.model('Account', accountSchema);

Account.create({
  phoneNumber: process.env.EXAMPLE
})
 
module.exports = Account;