angular.module('mealpal')
  .component('receiptItemController', {
    templateUrl: '../templates/receipt-item.html',
    bindings: {
      item: "="
    }
  });
