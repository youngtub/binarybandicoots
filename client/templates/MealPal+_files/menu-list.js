angular.module('mealpal')
  .component('menuList', {
    templateUrl: '../templates/menu-list.html',
    bindings: {
      item: "=",
      click: "="
    }
  })
