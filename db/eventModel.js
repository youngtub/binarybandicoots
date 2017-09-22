const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    eventName: { type: String, required: true },
    tipRate: { type: Number, default: 18 },
    taxRate: { type: Number, default: 8.875 },
    discountRaw: { type: Number, default: 0 },
    discountRate: { type: Number, default: 0 },
    totalDiners: { type: Number, required: true },
    responsesSoFar: { type: Number, required: true },
  },
  {
    timestamps: { type: Date, createdAt: 'created_at' }
  }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;