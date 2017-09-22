angular.module('mealpal')
  .component('chosenList', {
    templateUrl: '../templates/chosen-list.html',
    bindings: {
      item: "=",
      click: "=",
      changeQuantity: "="
    }
  })
