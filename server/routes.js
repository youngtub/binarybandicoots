const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Promise = require('bluebird');
const app = express();
const db = require('../db/db.js');
const itemModel = require('../db/itemModel.js')

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  console.log('Serving /index.');
});

app.post('/meals', (req, res) => {
  console.log(req.body);

  // We first create a new Event document in order to generate a unique Primary Key for each Item document in the Items table
  // If an Event Name was specified by the Organizer, use that; otherwise use an empty string
  eventModel.create({
    eventName: req.body.eventName || ' '
  })
  // Using the Document returned by eventModel.create, insert each Item into the database
  // When ALL items have been inserted (hence Promise.all), send the Response back to the client-side
  .then(event => {
    return Promise.all(req.body.data.map(item => {
      return itemModel.create({
        eventID: event._id,
        itemName: item.itemName,
        quantity: item.quantity || 1,
        price: item.price
      });
    }))
  })
  .then(insertedItems => res.send(insertedItems));
});

app.get('/meals', (req, res) => {
  console.log('Serving /meals.');
});

app.post('/share', (req, res) => {
  console.log('Receiving data at /share.');
});

app.get('/results', (req, res) => {
  console.log('Serving /results.');
});

module.exports = app;