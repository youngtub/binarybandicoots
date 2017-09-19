const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  eventName: { type: String, required: true },
  tipRate: {type: number},
  taxRate: {type: number}  
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;