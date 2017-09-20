exports.calculateTotals = function(items) {
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
  let grandTax = 0;
  let grandTip = 0;
  let grandTotal = 0;

  // go through each Diner to get meal totals
  dinerArray.forEach(diner => {
    grandBase += diner.base;
    diner.tax = roundMoney(diner.base * (0.08875)); //PLACEHOLDER TAX RATE
    grandTax += diner.tax;
    diner.tip = roundMoney (diner.base * (0.18));  //PLACEHOLDER TIP RATE
    grandTip += diner.tip;
    diner.total = diner.base + diner.tax + diner.tip;
    grandTotal += diner.total; 
  });

  // fix JS rounding errors
  grandTax = roundMoney(grandTax);
  grandTip = roundMoney(grandTip);
  grandTotal = roundMoney(grandTotal);

  return {grandBase, grandTax, grandTip, grandTotal, dinerArray};
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