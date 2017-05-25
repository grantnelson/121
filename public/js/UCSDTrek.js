var app = angular.module('UCSDTrek', ['ui.sortable']);

//For data binding "mustache"
app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});



app.controller('mainController', function($scope){

  $scope.numbers = [{}];
  $scope.courses = [{}];

  $scope.addClass = function(){
    $scope.courses.push({});
      setTimeout(function(){
        autocompleteInit();
      }, 1);
   };

  $scope.removeCourse = function(array, index){
    array.splice(index, 1);
  };

});
