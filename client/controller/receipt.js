angular.module('mealpal')
  .controller('ReceiptController', function($scope, $location) {
    var id = $location.url().slice(9);
    // console.log(id)

    this.$onInit = () => {
      axios.get(`/receipt/${id}`)
        // .then()
        .catch(err => {
          $scope.$apply(() => {
            this.payers = [
              {diner: 'Jon', total: 28.5, items: [['chicken',10], ['steak', 15], ['lemonade', 10], ['ice cream', 1]]},    // 10 + 7.5 + 10
              {diner: 'Paul', total: 17.5, items: [['tomato',7], ['steak', 15], ['water', 10]]},
              {diner: 'Craig', total: 7, items: [['broccoli',2], ['hamburger', 3], ['strawberry juice', 3]]},
              {diner: 'Kenny', total: 14, items: [['figs',2 ], ['lemons', 6], ['grape juice', 6]]}
            ]
          })
          // console.log(this.payers)
        })
    }


  })
