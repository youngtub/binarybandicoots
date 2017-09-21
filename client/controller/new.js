angular.module('mealpal')
.controller('NewController', function($scope, $state) {

  // original menuList from google, used to re-render filter
  this.originalList = [];

  // stores the menu data from scraping
  this.menuList = [];

  // stores what the organizer chooses
  this.chosenList = [];

  this.customItem = {};
  this.eventName = 'party';

  this.filterMenu = () => {
    let temp = this.originalList.slice(0);
    temp = temp.filter(option => {
      console.log(this.menuBar)
      return option.item.toLowerCase().includes(this.menuBar)
    })
    console.log(this.customItem);
    this.menuList = temp;
  }

  this.submitSearch = () => {
    // console.log(this.customItem);
    map = new google.maps.Map(document.getElementById("pac-input"));
    let restaurant = map.__gm.R.value.split(',')[0].replace(/ /g, '-').replace(/&/g, '-').toLowerCase();
    axios.post('/restaurant', { restaurant })
      .then(res => {
        $scope.$apply(this.menuList = res.data)
        this.originalList = res.data;
      })
      .catch(err => console.log(err))
  }



  this.addToReceipt = (item) => {
    console.log('addToReceipt')
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
    var temp = Object.assign({}, this.customItem);
    temp.price = '$' + temp.price; 
    this.chosenList.push(temp);
    this.customItem = {};
  }




  this.submitEvent = () => {
    var toSend = this.chosenList.slice(0);
    toSend.forEach((item) => {
      item.quantity = parseInt(item.quantity);
      item.price = parseInt(item.price.slice(1));
    });
    axios.post('/meals', {
      eventName: this.eventName,
      receiptItems: toSend,
      phoneNumbers: ['+14158859149', '+16094626519']
    })
      .then((id) => {
        console.log('id', id);
        window.location.replace(`http://127.0.0.1:3000/#!/meal?${id.data}`);
      }).catch(err => console.log('error', err));
  }
  // console.log('controller', this)
})
