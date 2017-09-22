const Event = require('../db/eventModel.js');

exports.calculateTotals = function(items, rates) {
  // array to store all the diners, and diner information
  let dinerArray = [];
  // iterate through each individual item
  items.forEach(item => {
    // initiate each split
    let splitways = item.shares.length;
    // iterate through each split
    item.shares.forEach(splitter => {
      let dinerName = splitter;
      let orderedItem = item.itemName;
      let dinerPrice = roundMoney((item.quantity * item.price) / splitways);
      // check if diner is in dinerArray
      if (isNewDiner(dinerName, dinerArray)) {
        // if not already in the array, set up new Diner
        let diner = { dinerName };
        diner.items = [ [orderedItem, dinerPrice] ];
        diner.base = dinerPrice;
        diner.discount = 0;
        diner.tax = 0;
        diner.tip = 0;
        diner.total = 0;
        dinerArray.push(diner);
      } else {
        // else update Diner
        let index = dinerArrayIndexFinder(dinerName, dinerArray);
        dinerArray[index].items.push([orderedItem, dinerPrice]);
        dinerArray[index].base += dinerPrice;
      }
    });
  });
  // initiate the totals for the entire event
  let grandBase = 0; //aka subtotal
  let grandDiscount = 0;
  let grandDiscountRaw = 0;
  let grandTax = 0;
  let grandTip = 0;
  let grandTotal = 0;
  // iterate throuch each diner, adding to get event totals
  dinerArray.forEach(diner => {
    diner.discount = diner.base - roundMoney(diner.base * ((100 - rates.discountRate) / 100));
    grandDiscount += roundMoney(diner.discount);
    diner.base = roundMoney (diner.base * ( (100 - rates.discountRate) /100 ) );
    grandBase += diner.base;
    diner.tax = roundMoney(diner.base * (rates.taxRate/100)); 
    grandTax += diner.tax;
    diner.tip = roundMoney(diner.base * (rates.tipRate/100));  
    grandTip += diner.tip;
    diner.total = diner.base + diner.tax + diner.tip;
    grandTotal += diner.total;  
    // fix JS rounding errors
    diner.base = roundMoney(diner.base);
    // creating random pokemon number, within the first gen
    diner.pokemonNum = Math.floor((Math.random() * 150) + 1);
    diner.pokemonBg = JSON.stringify(diner.pokemonNum);
    if(diner.pokemonBg.length === 1) diner.pokemonBg = 00+diner.pokemonBg;
    if(diner.pokemonBg.length === 2) diner.pokemonBg = 0+diner.pokemonBg;
  });
  //needs to be rounded now for next if statement
  grandBase = roundMoney(grandBase);
  //  if a raw discount exists , apply it to each dinner as a percentage of how 
  //  much their individual bill was. Note that if both a percentage discount and 
  //  a raw discount is given, percentage discount will be calculated first, then 
  //  the raw discount. Both discounts are applied onto the subtotal, which is 
  //  the basis of which tax and tip are calculated on.
  if(rates.discountRaw !== 0){
    oldGrandBase = grandBase;
    // resets the grands, since they will have to be recalculated.
    grandBase = 0;
    grandTax = 0;
    grandTip = 0;
    grandTotal = 0;
    // iterate through each diner
    dinerArray.forEach(diner => {
      // calculate what percentage of the grand total they're paying for
      diner.discRawPerc = diner.base / oldGrandBase;
      // apply that percentage to the discount amount, claming it for that diner
      diner.discRawAmt = rates.discountRaw * diner.discRawPerc;
      //fix JS rounding errors
      diner.discRawAmt = roundMoney (diner.discRawAmt);
      //recalculate everything
      diner.discount += diner.discRawAmt;
      grandDiscount += diner.discRawAmt;
      grandDiscountRaw += diner.discRawAmt;
      diner.base = diner.base - diner.discRawAmt;      
      grandBase += diner.base;
      diner.tax = roundMoney(diner.base * (rates.taxRate/100) ); 
      grandTax += diner.tax;
      diner.tip = roundMoney (diner.base * (rates.tipRate/100) );  
      grandTip += diner.tip;
      diner.total = diner.base + diner.tax + diner.tip;
      grandTotal += diner.total;  
      // fix JS rounding errors
      diner.base = roundMoney(diner.base);
      grandBase = roundMoney(grandBase);
      grandDiscountRaw = roundMoney(grandDiscountRaw);
    })
  }
  //iterate through each diner to fix JS rounding errors
  dinerArray.forEach(diner => {
    diner.discount = roundMoney(diner.discount);
    diner.tax = roundMoney(diner.tax);
    diner.tip = roundMoney(diner.tip);
    diner.total = roundMoney(diner.total);
  })
  //fix JS rounding errors
  grandDiscount = roundMoney(grandDiscount);
  grandDiscountRate = rates.discountRate;
  grandTax = roundMoney(grandTax);
  grandTip = roundMoney(grandTip);
  grandTipRate = rates.tipRate;
  grandTotal = roundMoney(grandTotal);
  // (^'.')> Wish the return object goodbye! <('.'^)
  return {
    grandBase, grandDiscount, grandDiscountRate, 
    grandTax, grandTip, grandTipRate, grandTotal, 
    dinerArray,
  };
}

function roundMoney(int) {
  return Math.round(int * 100) / 100;
}

function isNewDiner(string, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].dinerName === string) return false;
  }
  return true;
}

function dinerArrayIndexFinder(string, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].dinerName === string) return i;
  }
}

//grabs all the rates attached to the event
exports.getRates = function(rates){
  let taxRate = rates[0].taxRate;
  let tipRate = rates[0].tipRate;
  let discountRaw = rates[0].discountRaw;
  let discountRate = rates[0].discountRate;
  let obj = {taxRate, tipRate, discountRaw, discountRate};
  return obj;
}