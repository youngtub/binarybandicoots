angular.module('mealpal')
.controller('AccountController', function($scope, $location) {
  this.account = $location.url().slice(9);
  console.log('acct#', this.account);
  this.receipts = [];

  this.$onInit = () => {
    console.log('initializing');
    axios.get('/history/' + this.account)
    .then(eventIds => {
      console.log('got eventIds', eventIds)
      $scope.$apply(() => this.receipts = eventIds)
    })
    .catch(err => {
      console.log('err in getting receipts:', err)
    });
  }
})