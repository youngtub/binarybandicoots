angular.module('mealpal')
  .controller('ReceiptController', function($scope, $location) {
    var id = $location.url().slice(9);
    // console.log(id)

    this.$onInit = () => {
      axios.get(`/receipt/${id}`)
      .then(items => {
        console.log('items', items)
        var pokemonNum = Math.floor((Math.random() * 150) + 1);        
        $scope.$apply(() => {
          this.payers = items.data.dinerArray;
          console.log('now payers is', this.payers);
        })
        // console.log(this.payers)
      })
      .catch(err => {
        console.log('receipt get error', err);
      })
    }

    this.sendNumber = () => {
      console.log('number', this.number)
      axios.post('/accounts', {number: this.number})
      .then(() => {
        console.log('i think it is sent')
      })
    }
  })
