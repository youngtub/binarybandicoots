angular.module('mealpal')
.controller('NewController', function($scope, $state) {

  // original menuList from google, used to re-render filter
  this.originalList = [];

  // stores the menu data from scraping
  this.menuList = [];

  // stores what the organizer chooses
  this.chosenList = [];

  this.customItem = {};
  this.eventName = '';
  this.phoneList = [];
  this.discountRate = 0;
  this.tipRate = 0;

  this.subTotal = 0;

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
    let restaurant = map.__gm.R.value
                     .split(',')[0]
                     .replace(/ /g, '-')
                     .replace(/&/g, '-')
                     .replace(/'/g, '')
                     .toLowerCase();
    axios.post('/restaurant', { restaurant })
      .then(res => {
        $scope.$apply(this.menuList = res.data)
        this.originalList = res.data;
      })
      .catch(err => console.log(err))
  }

  this.addPhone = () => {
    this.phone = '+1' + this.phone;
    if (!this.phoneList.includes(this.phone)) {
      this.phoneList.push(this.phone);
    }
    this.phone = '';
  }

  this.calculateSubtotal = () => {
    this.subTotal = 0;
    this.chosenList.forEach(item => {
      if (item.quantity) {
        this.subTotal += Number(item.price.slice(1)) * Number(item.quantity);
      } else {
        this.subTotal += Number(item.price.slice(1));
      }
    })
    this.subTotal -= this.subTotal * (this.discountRate/100);
    this.subTotal += this.subTotal * (this.tipRate/100);
    parseFloat(Math.round(this.subTotal * 100) / 100).toFixed(2);
  }



  this.addToReceipt = (item) => {
    console.log('addToReceipt')
    var idx = this.menuList.indexOf(item);
    this.menuList.splice(idx, 1);
    this.chosenList.push(item);
    this.calculateSubtotal();
    console.log(this.subTotal)
  }

  this.remove = (item) => {
    console.log('hihihihi');
    var idx = this.chosenList.indexOf(item);
    this.chosenList.splice(idx, 1);
    this.menuList.unshift(item);
    this.calculateSubtotal();
  }

  this.changeQuantity = (operator, item) => {
    let idx = this.chosenList.indexOf(item);
    operator === '-' ? this.chosenList[idx].quantity-- : this.chosenList[idx].quantity++;
    this.calculateSubtotal();
  }

  this.addReceiptItem = () => {
    var temp = Object.assign({}, this.customItem);
    temp.price = '$' + temp.price;
    this.chosenList.push(temp);
    this.customItem = {};
  }


  this.submitEvent = () => {
    console.log('before', this.chosenList)
    var toSend = this.chosenList.slice(0);
    toSend.forEach((item) => {
      item.quantity = Number(item.quantity);
      if (typeof item.price === 'string') {
        item.price = Number(item.price.slice(1));
      }
    });
    console.log(toSend);
    axios.post('/meals', {
      eventName: this.eventName,
      receiptItems: toSend,
      phoneNumbers: this.phoneList,
      discountRate: this.discountRate,
      tipRate: this.tipRate
    })
      .then((id) => {
        console.log('id', id);
        window.location.replace(`http://127.0.0.1:3000/#!/meal?${id.data}`);
      }).catch(err => console.log('error', err));
  }
  // console.log('controller', this)
})
