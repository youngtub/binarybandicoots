const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Promise = require('bluebird');
const app = express();
const db = require('../db/db.js');
const Item = require('../db/itemModel.js');
const Event = require('../db/eventModel.js');
const algorithm = require('./kennysMagicalAlgorithm.js');
const axios = require('axios');
const htmlMiner = require('html-miner');

app.use(express.static('client'));
app.use(bodyParser.json());

app.use(cors());

app.post('/restaurant', (req, res) => {
  axios.get(`http://places.singleplatform.com/${req.body.restaurant}/menu?ref=google`)
    .then(html => {
      let menuData = htmlMiner(html.data, {
        spanList: {
          _each_: '.title-row',
          item: '.title',
          price: '.price',
          price2: '.price is right'
        }
      })
      res.send(menuData);
    })
    .catch(err => res.send('Error retrieving from restaurant page:', err))
});

app.post('/meals', (req, res) => {
  // We first create a new Event document in order to generate a unique Primary Key for each Item document in the Items table
  // If an Event Name was specified by the Organizer, use that; otherwise use an empty string
  Event.create({
    eventName: req.body.eventName || ' '
  })
  // Using the Document returned by Event.create, insert each Item into the database
  .then(event => {
    return Promise.all(req.body.receiptItems.map(item => {
      return Item.create({
        eventID: event._id,
        itemName: item.itemName,
        quantity: item.quantity || 1,
        price: item.price
      });
    }))
  })
  // When ALL items have been inserted (hence Promise.all), send the Response back to the client-side
  .then(insertedItems => {
    res.send(200, insertedItems[0].eventID);
  })
  .catch(err => res.send('Database insertion error:', err));
});

app.get('/meals*', (req, res) => {
  Item.find({ eventID: req.url.slice(7) })
    .then(items => res.send(items))
    .catch(err => res.send('Database retrieval error:', err));
});

app.post('/share', (req, res) => {
  console.log('req.body /share', req.body);
  Promise.all(req.body.receiptItems.map(item => {
    let query = { _id: item };
    let update = { $push: { shares: req.body.diner } };
    let options = { new: true };
    return Item.findOneAndUpdate(query, update, options);
  }))
    .then(updatedItems => res.send(updatedItems))
    .catch(err => res.send('Database update error:', err));
});

app.get('/receipt*', (req, res) => {
  let event = req.url.slice(9)
  Item.find({ eventID: event })
    .then(items => {
      console.log('items:', items);
      let receiptTotals = algorithm.calculateTotals(items);
      console.log('receiptTotals:', receiptTotals);
      res.send(receiptTotals);
    })
});

module.exports = app;
