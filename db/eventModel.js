var mongoose = require('mongoose')

var eventsSchema = mongoose.Schema({
  eventName: {type: String, required:true}
});

var eventModel = mongoose.model('EventModel', eventSchema);

module.exports = eventModel;