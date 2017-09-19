angular.module('mealpal', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state({
        name: 'new',
        url: '/',
        template: '<div>HELLO</div>',
        controller: 'NewController'
      })
      // .state({
      //   name: 'meal*',
      //   url: '/',
      //   controller: 'MealController'
      // })
      // .state({
      //   name: 'receipt*',
      //   url: '/',
      //   controller: 'ReceiptController'
      // })
      // .state({
      //   name: '404',
      //   url: '/404',
      //   template: "<p>Not Found</p>"
      // })
      //$urlRouterProvider.otherwise('404')
  });

  // '/templates/new-view.html'
