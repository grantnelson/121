var app = angular.module('UCSDTrek', []);

app.controller('mainController', function($scope){

  $scope.courses = [{}];

  $scope.addClass = function(){
    $scope.courses.push({});
  };

  $scope.removeCourse = function(e){
    angular.element(e.target).parent().remove();
  };

});
