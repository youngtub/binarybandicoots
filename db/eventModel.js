const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  eventName: { type: String, required: true },
  tipRate: {type: Number},
  taxRate: {type: Number}  
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;