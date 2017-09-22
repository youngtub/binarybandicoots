angular.module('mealpal')
  .controller('MealController', function($scope, $location) {
    var location = window.location.href
    var host = location.slice(0, location.indexOf('/#!/'))

    $scope.receiptItems = [
      'sample'
    ];
    var id = $location.url().slice(6);

    this.$onInit = () => {
      this.try()
    }
    //
    this.handleSubmit = () => {
      axios.post(`/share`, {
        diner: this.diner,
        eventID: id,
        receiptItems: $scope.receiptItems.filter((item) => item.isShare).map(item => item._id)
      })
      .then(res => {
        console.log('res gotten', res);
        window.location.replace(`${host}/#!/receipt?${id}`)
      })
      .catch(err => console.log('meal post error', err))
    }

    // on initialize
    this.try = () => {
      // get id from url
      console.log('this', $scope)
      // send get request to database using the id
      axios.get(`/meals/${id}`)
      .then((receiptItems) => {
        console.log('receiptItems', receiptItems);
        $scope.$apply(() => {$scope.receiptItems = receiptItems.data});
      })
      .catch(err => {
        console.log('meal 31', err);
        $scope.$apply(() => {$scope.receiptItems = [
          {item: 'chicken', quantity: 3, price: 12, shares:[], _id: 'key'},
          {item: 'steak', quantity: 1, price: 5, shares:[], _id: 'key2'}
        ]})
      });
    }
  });
