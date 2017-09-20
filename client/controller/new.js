angular.module('mealpal')
.controller('NewController', function($scope, $state) {

  this.handleClick = () => {
    console.log(this)
  }

  this.googleSearch = 'hello'

  this.submitSearch = () => {
    console.log('submitSearch');
    map = new google.maps.Map(document.getElementById("pac-input"));
    // console.log(map);

    let restaurant = map.__gm.R.value.split(',')[0].toLowerCase();
    axios.post('/restaurant', { restaurant })
      .then(res => console.log(res));
  }

  this.eventName = 'party';

  this.receiptItems = [{},{},{},{},{}]

  this.addReceiptItem = () => {
    this.receiptItems.push({});
  }

  this.submitEvent = () => {
    var toSend = this.receiptItems.filter((item) => !!item.itemName);
    toSend.forEach((item) => item.quantity = parseInt(item.quantity));
    this.receiptItems = toSend;
    console.log('stuff', JSON.stringify(this))
    axios.post('/meals', this)
      .then((id) => {
        console.log('id', id);
        window.location.replace(`http://127.0.0.1:3000/#!/meal?${id.data}`);
      }).catch(err => console.log('error', err));
  }
  console.log('controller', this)
})


// meals?{$id}
