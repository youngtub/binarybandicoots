angular.module('mealpal')
  .controller('ReceiptController', function($scope, $location) {
    var id = $location.url().slice(9);
    console.log(id)





    this.$onInit = () => {
      axios.get(`/receipt/${id}`)
        // .then()
        .catch(err => {
          $scope.$apply(() => {
            this.payers = [
              {diner: 'Jon', total: 27.5, items: {chicken: 10, steak: 15, lemonade: 10}},    // 10 + 7.5 + 10
              {diner: 'Paul', total: 17.5, items: {tomato: 7, steak: 15, water: 3}}          // 7 + 7.5 + 3
            ]
          })
          console.log(this.payers)
        })
    }


  })
