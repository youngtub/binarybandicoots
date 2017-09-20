const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Promise = require('bluebird');
const app = express();
const db = require('../db/db.js');
const Item = require('../db/itemModel.js');
const Event = require('../db/eventModel.js');

app.use(express.static('client'));
app.use(bodyParser.json());

app.use(cors());

app.post('/meals', (req, res) => {
  console.log('req.body /meals', req.body)
  // We first create a new Event document in order to generate a unique Primary Key for each Item document in the Items table
  // If an Event Name was specified by the Organizer, use that; otherwise use an empty string
  Event.create({
    eventName: req.body.eventName || ' '
  })
  // Using the Document returned by Event.create, insert each Item into the database
  // When ALL items have been inserted (hence Promise.all), send the Response back to the client-side
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
  .then(insertedItems => {
    console.log(insertedItems[0].eventID);
    res.send(200, insertedItems[0].eventID);
  })
  .catch(err => res.send('Database insertion error:', err));
});

// req.headers.id is a placeholder for the actual Client/Server request interaction that will eventually be in place
app.get('/meals*', (req, res) => {
  console.log('req.url:', req.url);
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
  console.log('is this id right', event);
  let dinerArray = [];
  // get all the items in the event
  Item.find({eventID: event})
  .then( (items) => {
    //go through each item
    items.forEach((item)=> {
      let splitways = item.shares.length;
      //for every person splitting that item.
      item.shares.forEach((splitee) => {
        let dinerName = splitee;
        let orderedItem = item.itemName;
		//how much the diner should pay for that item
        let dinerPrice = roundMoney ( (item.quantity*item.price) / splitways)
        //check if diner is in dinerArray
        if(isNewDiner(dinerName, dinerArray)){
		  //setup new diner
          let obj = {dinerName};
          obj.items = [ [ orderedItem, dinerPrice ] ];
          obj.base = dinerPrice;
          obj.tax = 0;
		  obj.tip = 0;
          obj.total = 0;
          dinerArray.push(obj)
        } else {
	      //else update diner
          let index = dinerArrayIndexFinder(dinerName, dinerArray);
          dinerArray[index].items.push([orderedItem, dinerPrice])
          dinerArray[index].base += dinerPrice 
        }
      })
    })
  let grandBase = 0;
  let grandTax = 0;
	let grandTip = 0;
	let grandTotal = 0;
	//go through each diner to get meal totals
  dinerArray.forEach((diner) => {
	  grandBase += diner.base;
	  diner.tax = roundMoney(diner.base * (0.08875) ) //PLACEHOLDER TAX RATE
    grandTax += diner.tax;
	  diner.tip = roundMoney (diner.base * ( 0.18) )  //PLACEHOLDER TIP RAT
	  grandTip += diner.tip;
    diner.total = diner.base+diner.tax+diner.tip
	  grandTotal += diner.total	  
  })
    grandTax = roundMoney( grandTax ) //shouldn't be necessary? Needs more testing
    grandTip = roundMoney( grandTip ) //shouldn't be necessary? Needs more testing
	  grandTotal = roundMoney( grandTotal ) //shouldn't be necessary? Needs more testing
    let obj = {grandBase, grandTax, grandTip, grandTotal, dinerArray};
    res.send(obj)
  })
});

function roundMoney(int){
  return ( Math.round(int * 100) ) / 100
}

function isNewDiner(string, arr){
  for ( let i = 0; i < arr.length; i++) {
    if(arr[i].dinerName === string) return false;
  }
  return true
}

function dinerArrayIndexFinder(string, arr){
  for ( let i = 0; i < arr.length; i++){
    if(arr[i].dinerName === string) return i;
  }
}

module.exports = app;