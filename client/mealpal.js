angular.module('mealpal', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state({
        name: 'new',
        url: '/new',
        templateUrl: './templates/new.html',
        controller: 'NewController'
      })
      .state({
        name: 'meal',
        url: '/meal',
        templateUrl: './templates/meal.html',
        controller: 'MealController'
      })
      .state({
        name: 'receipt',
        url: '/receipt',
        templateUrl: './templates/receipt.html',
        controller: 'ReceiptController'
      })
      .state({
        name: 'account',
        url: '/account',
        templateUrl: './templates/account.html',
        controller: 'AccountController'
      })
      .state({
        name: '404',
        url: '/404',
        template: "<p>Not Found</p>"
      })
      $urlRouterProvider.otherwise('new')
  });

  // '/templates/new-view.html'
