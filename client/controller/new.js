angular.module('mealpal')
.controller('NewController', function($scope, $state) {

  this.handleClick = () => {
    console.log(this)
  }

  this.eventName = 'party';

  this.receiptItems = [{},{},{},{},{}]

  this.addReceiptItem = () => {
    this.receiptItems.push({});
  }

  this.submitEvent = () => {
    console.log(this.receiptItems)
    var id = '123'
    axios.post('/meals', this)
      // .then(id => $state.go(`/meal?{$id}`))
      .catch(err => window.location.replace(`http://127.0.0.1:65115/#!/meal?${id}`));
  }
  console.log('controller', this)
})


// meals?{$id}
