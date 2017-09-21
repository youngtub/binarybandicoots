require('dotenv').config();
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
const algorithm = require('./kennysMagicalAlgorithm.js');
const axios = require('axios');
const htmlMiner = require('html-miner');

app.use(express.static('client'));
app.use(bodyParser.json());
app.use(cors());

app.post('/restaurant', (req, res) => {
  console.log(req.body.restaurant)
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
    .catch(err => res.send('Error retrieving from restaurant page:', err))
});

app.post('/meals', (req, res) => {
  // We are expecting in req.body:
  // { eventName: eventName, 
  //   receiptItems: [ { item1 }, { item2 }, ... ], 
  //   phoneNumbers: [ phoneNumber1, phoneNumber2, ... ] }

  // This variable will get set in the first .then block, just after creating the new Event mongoose document
  var currentEventID;
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
      console.log('currently mapping')
      let query = { phoneNumber };
      let update = { $push: { events: currentEventID } };
      let options = { new: true, upsert: true };
      return Account.findOneAndUpdate(query, update, options);
    }));
  })
  // Using currentEventID, insert each Item into the database
  .then(() => {
    console.log('made it this far 1', currentEventID)
    console.log('req.body', req.body)

    return Promise.all(req.body.receiptItems.map(item => {
      console.log('mapping 2');
      return Item.create({
        eventID: currentEventID,
        itemName: item.item,
        quantity: item.quantity || 1,
        price: item.price
      });
    }))
  })
  // When ALL items have been inserted (hence the uses of Promise.all), send currentEventID back to the client-side
  .then(() => {
    console.log('made it this far 2, id=', currentEventID)
    res.send(200, currentEventID);
  })
  .catch(err => res.send(('Database insertion error:', err)));
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

app.post('/taxRate', (req,res) => {
  console.log('hit server');
  console.log(req.body);
  var rate = getTaxRateLatLng(req.body.latlng);
  res.send(rate);
});

app.post('/accounts', (req, res) => {
  console.log('/accounts req.body:', req.body);
  var number = '+1' + req.body.number;
  Account.findOne({
    phoneNumber: number
  })
  .then(acct => {
    console.log('accout found or not??:', acct);
    if (acct) {
      console.log('acct', acct);
      var acctId = acct._id;
      console.log('acctId', acctId);
      console.log('number', number);
      Client.messages.create({
        from: process.env.FROM,
        to: number,
        body: 'http://' + process.env.HOST + ':' + process.env.PORT + '/#!/account?' + acctId
      })
      .then(message => console.log('message sent', message))
      .catch(err => console.log('err', err));
      res.status(201).send('it worked');
    } else {
      res.status(400).send('error, you do not have an account somehow');
    }  
  })
  .catch(err => res.status(400).send('error posting to /accounts', err));
})

app.get('/receipt*', (req, res) => {
  let currentItems;
  let event = req.url.slice(9);
  //gets all the items corresponding to this event
  Item.find({eventID: event})
    .then(items => {
      currentItems = items;
      //gets all the rates corrsponding to this event
      return Event.find({_id: event})
    })
    .then(event => {
      var rateObject = algorithm.getRates(event);
      let receiptTotals = algorithm.calculateTotals(currentItems, rateObject);
      res.send(receiptTotals);
    })
});

app.get('/history*', (req, res) => {
  let id = req.url.slice(9);
  console.log('id', id);
  Account.findOne({ _id: id })
    .then(account => {
      console.log('account', account);
      res.send(account.events);
    })
    .catch(err => {
      res.send('Error finding Account in database:', err);
    });
});

module.exports = app;
