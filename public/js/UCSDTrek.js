var app = angular.module('UCSDTrek', []);



app.controller('mainController', function($scope){

  $scope.numbers = [{}];

  $scope.courses = [{}];

  $scope.addClass = function(){

      $scope.courses.push({});
      setTimeout(function(){
        autocompleteInit();
      }, 1);

    //$scope.number = $scope.number + 1;
   };

  $scope.removeCourse = function(e){
    angular.element(e.target).parent().parent().parent().parent().remove();
  };

});
