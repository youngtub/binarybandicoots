angular.module('mealpal')
.controller('AccountController', function($scope, $location) {
  var id = $location.url().slice(6);
})