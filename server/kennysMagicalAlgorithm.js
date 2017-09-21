const Event = require('../db/eventModel.js');

exports.calculateTotals = function(items, rates) {
  let dinerArray = [];
  items.forEach(item => {
    let splitways = item.shares.length;

    item.shares.forEach(splitter => {
      let dinerName = splitter;
      let orderedItem = item.itemName;
      let dinerPrice = roundMoney((item.quantity * item.price) / splitways);

      //check if Diner is in dinerArray
      if (isNewDiner(dinerName, dinerArray)) {
        // if not already in the array, set up new Diner
        let diner = { dinerName };
        diner.items = [ [ orderedItem, dinerPrice ] ];
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

  let grandBase = 0;
  let grandDiscount = 0;
  let grandTax = 0;
  let grandTip = 0;
  let grandTotal = 0;

  // go through each Diner to get meal totals
  dinerArray.forEach(diner => {
    diner.discount = diner.base - roundMoney ( diner.base * ( (100 - rates.discountRate) /100 ) );
    grandDiscount += roundMoney(diner.discount);
    diner.base = roundMoney ( diner.base * ( (100 - rates.discountRate) /100 ) );
    grandBase += diner.base;
    diner.tax = roundMoney(diner.base * (rates.taxRate/100)); 
    grandTax += diner.tax;
    diner.tip = roundMoney (diner.base * (rates.tipRate/100));  
    grandTip += diner.tip;
    diner.total = diner.base + diner.tax + diner.tip;
    grandTotal += diner.total;  
    //fix JS rounding errors
    diner.base = roundMoney( diner.base ) 
    diner.discount = roundMoney( diner.discount )
    diner.tax = roundMoney( diner.tax )
    diner.tip = roundMoney( diner.tip )
    diner.total = roundMoney( diner.total )
  });
  
  // fix JS rounding errors
  grandBase = roundMoney(grandBase);
  grandDiscount = roundMoney( grandDiscount );
  grandDiscountRate = rates.discountRate;
  grandTax = roundMoney(grandTax);
  grandTip = roundMoney(grandTip);
  grandTipRate = rates.tipRate;
  grandTotal = roundMoney(grandTotal);
  
  return {grandBase, grandDiscount, grandDiscountRate, grandTax, grandTip, grandTipRate, grandTotal, dinerArray};
}

function roundMoney(int) {
  return (Math.round(int * 100)) / 100;
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

exports.getRates = function(rates){
  let taxRate = rates[0].taxRate;
  let tipRate = rates[0].tipRate;
  let discountRaw = rates[0].discountRaw;
  let discountRate = rates[0].discountRate;
  let obj = {taxRate, tipRate, discountRaw, discountRate};
  return obj;
}