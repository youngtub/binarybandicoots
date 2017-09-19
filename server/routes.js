const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Promise = require('bluebird');
const app = express();
const db = require('../db/db.js');
const Item = require('../db/itemModel.js');
const Event = require('../db/eventModel.js');

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  console.log('Serving /index.');
});

app.post('/meals', (req, res) => {
  // We first create a new Event document in order to generate a unique Primary Key for each Item document in the Items table
  // If an Event Name was specified by the Organizer, use that; otherwise use an empty string
  Event.create({
    eventName: req.body.eventName || ' '
  })
  // Using the Document returned by Event.create, insert each Item into the database
  // When ALL items have been inserted (hence Promise.all), send the Response back to the client-side
  .then(event => {
    return Promise.all(req.body.data.map(item => {
      return Item.create({
        eventID: event._id,
        itemName: item.itemName,
        quantity: item.quantity || 1,
        price: item.price
      });
    }))
  })
  .then(insertedItems => res.send(insertedItems))
  .catch(err => res.send('Database insertion error:', err));
});

// req.headers.id is a placeholder for the actual Client/Server request interaction that will eventually be in place
app.get('/meals', (req, res) => {
  console.log('req.headers:', req.headers);
  Item.find({ eventID: req.headers.id })
    .then(items => res.send(items))
    .catch(err => res.send('Database retrieval error:', err));
});

app.post('/share', (req, res) => {
  Promise.all(req.body.items.map(item => {
    let query = { _id: req.body.id };
    let update = { $push: { shares: req.body.diner } };
    let options = { new: true };
    return Item.findOneAndUpdate(query, update, options);
  }))
    .then(updatedItems => res.send(updatedItems))
    .catch(err => res.send('Database update error:', err));
});

app.get('/results', (req, res) => {
  console.log('Serving /results.');
});

module.exports = app;