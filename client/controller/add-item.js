angular.module('mealpal')
  .component('addItem', {
    templateUrl: '../templates/add-item.html',
    bindings: {
      customItem: "<"
    }
  })
