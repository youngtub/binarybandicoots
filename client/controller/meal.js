angular.module('mealpal')
  .controller('MealController', function($scope, $location) {
    $scope.receiptItems = [
      'sample'
    ];
    var id = $location.url().slice(6);

    this.$onInit = () => {
      this.try()
    }
    //
    this.handleSubmit = () => {
      axios.post(`/share/${id}`, {
        diner: this.diner,
        receiptItems: $scope.receiptItems.map(item => item._id)
      })
      // .then()
      .catch(err => window.location.replace(`http://127.0.0.1:65115/#!/receipt?${id}`))
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
