angular.module('mealpal')
  .component('mealItemController', {
    templateUrl: '../templates/meal-item.html',
    bindings: {
      receiptItem: "="
    },
    controller: function() {

      this.$onInit = () => {
        this.receiptItem.isShare = false;
        console.log(this.receiptItem)

      }

      this.toggle = function() {
        this.receiptItem.isShare = !this.receiptItem.isShare;
        console.log('clicked', this.receiptItem)
      }
      // console.log(this.receiptItem)
    }
  });
