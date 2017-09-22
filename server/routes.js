require('../db/db.js');
require('dotenv').config(); 
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const Promise = require('bluebird');
const twilio = require('./twilio.js');
const htmlMiner = require('./htmlMiner.js');
const database = require('./databaseHelpers.js');
const algorithm = require('./calculations.js');
const db = require('../db/db.js')
const app = express();

app.use(express.static('client'));
app.use(bodyParser.json());
app.use(cors());

// This route sends the GET request to Google's menu page partner site
// req.body.restaurant is determined by the Organizer's selection in the Google Maps search

app.post('/restaurant', (req, res) => {
  console.log('POST /restaurant', req.body);
  axios.get(`http://places.singleplatform.com/${req.body.restaurant}/menu?ref=google`)
    .then(html => {
      let menuData = htmlMiner.scrape(html);
      menuData = menuData.itemList.filter(obj => obj.hasOwnProperty('price'));
      res.send(menuData);
    })
    .catch(err => res.send('Error retrieving restaurant menu:', err));
});

// This route is the main Data Receiver -- we insert new Documents into the Events, Accounts, and Items tables
  // We are expecting in req.body:
  // { eventName: eventName, 
  //   receiptItems: [ { item1 }, { item2 }, ... ], 
  //   phoneNumbers: [ phoneNumber1, phoneNumber2, ... ] }

app.post('/meals', (req, res) => {
  console.log('POST /meals', req.body);
  let currentEventID;
  database.createNewEvent(req.body.eventName, req.body.tipRate, req.body.taxRate, req.body.discountRaw, req.body.discountRate, req.body.phoneNumbers.length)
    .then(event => {
      currentEventID = event._id;
      return Promise.all(req.body.phoneNumbers.map(phoneNumber => {
        return database.createOrUpdateAccount(phoneNumber, currentEventID);
      }));
    })
    .then(() => {
      return Promise.all(req.body.receiptItems.map(item => {
        return database.createNewItem(item.item, item.quantity, item.price, currentEventID);
      }));
    })
    .then(() => {
      req.body.phoneNumbers.forEach(phoneNumber => {
        twilio.sendTextWithEventInfo(phoneNumber, currentEventID);
      });
    })
    .then(() => {
      res.status(200).send(currentEventID);
    })
    .catch(err => res.send(('Database insertion error:', err)));
});

// This route gets all the items in the Items table that have the eventID provided in the URL

app.get('/meals*', (req, res) => {
  console.log('GET /meals', req.url);
  database.getItems(req.url.slice(7))
    .then(items => res.send(items))
    .catch(err => res.send('Database retrieval error:', err));
});

// This route handles one POST request per Diner
// It updates the shares array of each Item in the database with the appropriate Diner
// Then it sends back the new Items for rendering the Results page

app.post('/share', (req, res) => {
  console.log('POST /share', req.body);
  database.updateResponsesSoFarForEvent(req.body.eventID)
    .then(() => {
      return Promise.all(req.body.receiptItems.map(item => {
        return database.updateAndReturnItem(item, req.body.diner);
      }));
    })
    .then(() => res.status(201).send('Database updated.'))
    .catch(err => res.send('Database update error:', err));
});

// This route handles an individual Diner wanting to check their Events History
// We find the Account in the database, then send a text message via Twilio

app.post('/accounts', (req, res) => {
  console.log('POST /accounts', req.body);
  let phoneNumber = '+1' + req.body.number;
  database.getAccount(phoneNumber)
    .then(account => {
      if (account) {
        twilio.sendTextWithHistory(phoneNumber, account._id)
          .then(() => res.status(201).send('History sent'))
          .catch(err => res.status(400).send('Error sending text message with history:', err));
      } else {
        res.status(400).send('Error: you do not have an account');
      }  
    })
    .catch(err => res.status(400).send('Error finding Account in database:', err));
})

// This route calculates the Totals that each Diner owes, with Tax and Tip included

app.get('/receipt*', (req, res) => {
  console.log('GET /receipt', req.url);
  let currentItems;
  let eventID = req.url.slice(9);
  database.getItems(eventID)
    .then(items => {
      currentItems = items;
      return database.getEvent(eventID);
    })
    .then(event => {
      let eventRates = algorithm.getRates(event);
      let receiptTotals = algorithm.calculateTotals(currentItems, eventRates);
      receiptTotals.totalDiners = event.totalDiners
      receiptTotals.responsesSoFar = event.responsesSoFar
      res.send(receiptTotals);
    })
});

// This route finds a Diner's history and sends back all events they have been involved in

app.get('/history*', (req, res) => {
  console.log('GET /history', req.url);
  let id = req.url.slice(9);
  database.getAccount(id)
    .then(account => res.send(account.events))
    .catch(err => res.send('Error finding Account in database:', err));
});

module.exports = app;