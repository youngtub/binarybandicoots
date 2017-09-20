angular.module('mealpal')
.controller('NewController', function($scope, $state) {

  // stores the menu data from scraping
  this.menuList = [];

  // stores what the organizer chooses
  this.chosenList = [];


  this.submitSearch = () => {
    console.log('submitSearch');
    map = new google.maps.Map(document.getElementById("pac-input"));
    let restaurant = map.__gm.R.value.split(',')[0].replace(/ /g, '-').toLowerCase();
    axios.post('/restaurant', { restaurant })
      .then(res => {
        $scope.$apply(this.menuList = res.data)
        console.log(this.menuList)
      })
      .catch(err => console.log(err))
  }

  this.eventName = 'party';


  this.addToReceipt = (item) => {
    var idx = this.menuList.indexOf(item);
    this.menuList.splice(idx, 1);
    this.chosenList.push(item);
  }

  this.remove = (item) => {
    console.log('hihihihi');
    var idx = this.chosenList.indexOf(item);
    this.chosenList.splice(idx, 1);
    this.menuList.unshift(item);
  }

  // MAY DEPRECIATE
  this.receiptItems = [{},{},{},{},{}]

  // MAY DEPRECIATE
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
  // console.log('controller', this)
})
