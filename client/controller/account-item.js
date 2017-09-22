angular.module('mealpal')
.component('accountItem', {
  bindings: {
    receipt: '<'
  },
  templateUrl: '../templates/account-item.html',
  controller: function() {
    this.location = window.location.href
    this.host = this.location.slice(0, this.location.indexOf('/#!/'))
  }
});