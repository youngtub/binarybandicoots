var mongoose = require('mongoose')
 
var itemSchema = mongoose.Schema({
  eventID: {type: String, required:true},
  itemName: {type: String, required:true},
  quantity: {type: Number, required:true},
  price: {type: Number, required:true},
  shares: {type: Array, required:false},
  },
  {timestamps: {type: Date, createdAt: 'created_at' } }
);
 
 
var itemModel = mongoose.model('ItemModel', itemSchema);
 
module.exports = itemModel;