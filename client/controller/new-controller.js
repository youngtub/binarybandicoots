angular.module('mealpal')
.controller('NewController', function($scope) {

  this.handleClick = () => {
    console.log(this)
  }

  this.receiptItems = [{},{},{},{},{}]

  this.addReceiptItem = () => {
    this.receiptItems.push({});
    console.log(this.receiptItems)
  }


  console.log('controller', this)
})
