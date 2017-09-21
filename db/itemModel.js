const mongoose = require('mongoose');
 
const itemSchema = mongoose.Schema({
    eventID: { type: String, required: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    shares: { type: Array, required: false },
  },
  {
    timestamps: { type: Date, createdAt: 'created_at' }
  }
);
 
 
const Item = mongoose.model('Item', itemSchema);
 
module.exports = Item;