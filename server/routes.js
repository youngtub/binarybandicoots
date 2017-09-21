const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Promise = require('bluebird');
const app = express();
const Client = require('./twillio.js')
const db = require('../db/db.js');
const Item = require('../db/itemModel.js');
const Event = require('../db/eventModel.js');
const Account = require('../db/accountModel.js');
const algorithm = require('./calculations.js');
const axios = require('axios');
const htmlMiner = require('html-miner');
require('dotenv').config();

app.use(express.static('client'));
app.use(bodyParser.json());
app.use(cors());

// This route sends the GET request to Google's menu page partner site
// req.body.restaurant is determined by the Organizer's selection in the Google Maps search

app.post('/restaurant', (req, res) => {
  axios.get(`http://places.singleplatform.com/${req.body.restaurant}/menu?ref=google`)
    .then(html => {
      let menuData = htmlMiner(html.data, {
        itemList: {
          _each_: '.title-row',
          item: '.title',
          price: '.price'
        }
      })
      menuData = menuData.itemList.filter(obj => obj.hasOwnProperty('price'));
      res.send(menuData);
    })
    .catch(err => res.send('Error retrieving from restaurant page:', err));
});

// This route is the main Data Receiver -- we insert new Documents into the Events, Accounts, and Items tables

app.post('/meals', (req, res) => {
  // We are expecting in req.body:
  // { eventName: eventName, 
  //   receiptItems: [ { item1 }, { item2 }, ... ], 
  //   phoneNumbers: [ phoneNumber1, phoneNumber2, ... ] }

  // This variable will get set in the first .then block, just after creating the new Event mongoose document
  let currentEventID;
  // We first create a new Event document in order to assign the generated Primary Key to currentEventID
  // If an Event Name was specified by the Organizer, use that; otherwise use an empty string
  Event.create({
    eventName: req.body.eventName || '',
    tipRate: req.body.tipRate,
    taxRate: req.body.taxRate,
    discountRaw: req.body.discountRaw,
    discountRate: req.body.discountRate
  })
  .then(event => {
    // Set currentEventID using the returned mongoose Document's _id Primary Key property
    currentEventID = event._id;
    console.log('event._id', event._id)
    // Now, for each phone number, we either create a new Account and enter it into the DB, or we update the existing entry
    // Every Account entry has an associated phoneNumber and an array of all Events they have participated in
    return Promise.all(req.body.phoneNumbers.map(phoneNumber => {
      let query = { phoneNumber };
      let update = { $push: { events: currentEventID } };
      let options = { new: true, upsert: true };
      return Account.findOneAndUpdate(query, update, options);
    }));
  })
  // Using currentEventID, insert each Item into the database
  .then(() => {
    return Promise.all(req.body.receiptItems.map(item => {
      return Item.create({
        eventID: currentEventID,
        itemName: item.item,
        quantity: item.quantity || 1,
        price: item.price
      });
    }))
  })
  .then(() => {
    console.log('this block is happening - sending phone #s')
    req.body.phoneNumbers.forEach((number) => {
      Client.messages.create({
        from: process.env.FROM,
        to: number,
        body: 'http://' + process.env.HOST + ':' + process.env.PORT + '/#!/meal?' + currentEventID
      })
    })
    return 'done';
  })
  .then(() => {
    res.send(200, currentEventID);
  })
  .catch(err => res.send(('Database insertion error:', err)));
});

// This route gets all the items in the Items table that have the eventID provided in the URL

app.get('/meals*', (req, res) => {
  Item.find({ eventID: req.url.slice(7) })
    .then(items => res.send(items))
    .catch(err => res.send('Database retrieval error:', err));
});

// This route handles one POST request per Diner
// It updates the shares array of each Item in the database with the appropriate Diner
// Then it sends back the new Items for rendering the Results page

app.post('/share', (req, res) => {
  Promise.all(req.body.receiptItems.map(item => {
    let query = { _id: item };                          // req.body.diner is the Diner's name --
    let update = { $push: { shares: req.body.diner } }; // for the purposes of rendering the final receipt page
    let options = { new: true };
    return Item.findOneAndUpdate(query, update, options);
  }))
    .then(updatedItems => res.send(updatedItems))
    .catch(err => res.send('Database update error:', err));
});

// This route handles an individual Diner wanting to check their Events History
// We find the Account in the database, then send a text message via Twillio

app.post('/accounts', (req, res) => {
  let number = '+1' + req.body.number;
  Account.findOne({
    phoneNumber: number
  })
    .then(acct => {
      if (acct) {
        let acctId = acct._id;
        Client.messages.create({
          from: process.env.FROM,
          to: number,
          body: 'http://' + process.env.HOST + ':' + process.env.PORT + '/#!/account?' + acctId
        })
          .then(message => res.status(201).send('History sent'))
          .catch(err => res.status(400).send('Error sending text message with history:', err));
      } else {
        res.status(400).send('Error: you do not have an account');
      }  
    })
    .catch(err => res.status(400).send('Error finding Account in database:', err));
})

// This route calculates the Totals that each Diner owes, with Tax and Tip included

app.get('/receipt*', (req, res) => {
  let currentItems;
  let event = req.url.slice(9);
  Item.find({ eventID: event })
    .then(items => {
      currentItems = items;
      return Event.find({ _id: event })
    })
    .then(event => {
      let eventRates = algorithm.getRates(event);
      let receiptTotals = algorithm.calculateTotals(currentItems, eventRates);
      res.send(receiptTotals);
    })
});

// This route finds a Diner's history and sends back all events they have been involved in

app.get('/history*', (req, res) => {
  let id = req.url.slice(9);
  Account.findOne({ _id: id })
    .then(account => res.send(account.events));
    .catch(err => res.send('Error finding Account in database:', err));
});

module.exports = app;