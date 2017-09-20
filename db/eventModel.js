const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  eventName: { type: String, required: true },
  tipRate: {type: Number, default: 8.875},
  taxRate: {type: Number, default: 18},
  discountRaw: {type: Number, default: 0},
  discountRate: {type: Number, default: 0},  
},
  {
    timestamps: { type: Date, createdAt: 'created_at' }
  }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;