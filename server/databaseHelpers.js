const Item = require('../db/itemModel.js');
const Event = require('../db/eventModel.js');
const Account = require('../db/accountModel.js');

exports.createNewEvent = (eventName = '', tipRate, taxRate, discountRaw, discountRate) => {
  return Event.create({ eventName, tipRate, taxRate, discountRaw, discountRate });
};

exports.getEvent = (eventID) => {
  return Event.find({ _id: eventID });
};

exports.getAccount = (identifier) => {
  return identifier.length === 12 ? Account.findOne({ phoneNumber: identifier }) : Account.findOne({ _id: identifier });
};

exports.createOrUpdateAccount = (phoneNumber, eventID) => {
  let query = { phoneNumber };
  let update = { $push: { events: eventID } };
  let options = { new: true, upsert: true };
  return Account.findOneAndUpdate(query, update, options);
};

exports.createNewItem = (itemName, quantity = 1, price, eventID) => {
  return Item.create({ eventID, itemName, quantity, price });
};

exports.getItems = (eventID) => {
  return Item.find({ eventID });
};

exports.updateAndReturnItem = (item, diner) => {
  let query = { _id: item };
  let update = { $push: { shares: diner } };
  let options = { new: true };
  return Item.findOneAndUpdate(query, update, options);
};