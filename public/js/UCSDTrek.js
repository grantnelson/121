sessionStorage.setItem('toggleBool', true);

var app = angular.module('UCSDTrek', ['ui.sortable', 'ngMaterial']);

//For data binding "mustache"
app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});



app.controller('mainController', function($scope, $mdDialog){

  $scope.numbers = [{}];
  $scope.courses = [{}];

  $scope.autoComplete = function(){
    setTimeout(function(){
      autocompleteInit();
    }, 1);
  }

  $scope.addClass = function(){
    $scope.courses.push({});
      setTimeout(function(){
        autocompleteInit();
      }, 1);
  };

  $scope.removeCourse = function(array, index){
    array.splice(index, 1);
  };

  $scope.toggleStart = function(ev) {

    if(sessionStorage.getItem('toggleBool') == "true"){
      sessionStorage.setItem('toggleBool', false);
      document.getElementById("toggleStart").style.color = "#e1e3e8";
      console.log(false);
    }

    else {
      sessionStorage.setItem('toggleBool', true);
      document.getElementById("toggleStart").style.color = "#ef3737";
      console.log(true);
    }



  }



  //Modal
  $scope.scheduleModal = function(ev) {
    $mdDialog.show({
      controller: ModalController,
      templateUrl: 'modal.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
  };

  function ModalController($scope, $mdDialog) {
    $scope.days = [{}];

    //Pushing and popping day to/from days
    $scope.checkedDay = function(day){
      if(-1 == ($.inArray(day, $scope.days))){
        $scope.days.push(day);
        console.log($scope.days);
      }

      else {
        var index = $scope.days.indexOf(day);
        if (index > -1) {
          $scope.days.splice(index, 1);
        }
        console.log($scope.days);
      }
    };

    //Add to schedule
    $scope.addToSchedule = function(){

      //Save days to sessionStorage
      sessionStorage.setItem('days', JSON.stringify($scope.days));

      //Save course name
      var courses = document.getElementsByClassName('courseNames');
      var coursesArr = [];

      for (var i = 0; i < courses.length; i++){
        coursesArr.push(courses[i].value);
      }

      sessionStorage.setItem('courses', JSON.stringify(coursesArr));


      //Save class location
      var halls = document.getElementsByClassName('waypoints');
      var hallsArr = [];

      for (var i = 0; i < halls.length; i++){
        hallsArr.push(halls[i].value);
      }
      sessionStorage.setItem('halls', JSON.stringify(hallsArr));

      //Save room number
      var rooms = document.getElementsByClassName('roomNums');
      var roomsArr = [];

      for (var i = 0; i < rooms.length; i++){
        roomsArr.push(rooms[i].value);
      }
      sessionStorage.setItem('rooms', JSON.stringify(roomsArr));




      $mdDialog.hide();
    }

    //Hide add button
    $scope.checkDayLength = function(){
      if ($scope.days.length == 0) {
        return true;
      }

      else {
        return false;
      }
    }

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }


});
