angular.module('mealpal')
  .component('addItem', {
    templateUrl: '../templates/add-item.html',
    bindings: {
      receiptItem: "<"
    },
    controller: function() {
      this.onClick = () => {
        console.log('add-item', this);
      }
    }
  })
