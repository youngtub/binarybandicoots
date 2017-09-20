angular.module('mealpal')
  .component('menuList', {
    templateUrl: '../templates/menu-list.html',
    bindings: {
      item: "="
    },
    controller: function() {
      this.onClick = () => {
        console.log('menu-item', this);
      }
    }
  })
