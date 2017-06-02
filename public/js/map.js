var map, infoWindow;
var markersArray = [];
var currLoc = null;
var hallsArr = [];


//Initialize Map
function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
     center: {lat: 32.880060, lng: -117.234014},
     zoom: 15,
     mapTypeId: google.maps.MapTypeId.ROADMAP,
     styles:[
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#413e39"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f8f7ff"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#f1efe8"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "gamma": 1.33
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#00335f"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#eeebe3"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#00335f"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#afa9a0"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#00244e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#5f6f7a"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#8ac0c4"
      }
    ]
  }
]
   });

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer({map: map, suppressMarkers: true});

  autocompleteInit();

  infoWindow = new google.maps.InfoWindow;

  //Call calculate route when submit is clicked
  document.getElementById('submit').addEventListener('click', function() {
    var points= [];
    var origin = null;
    var destination = null;


    var courseNames = [];
    var roomNums = [];
    var loc_inputs = document.getElementsByClassName("waypoints");
    var names_inputs = document.getElementsByClassName("courseNames");
    var room_inputs = document.getElementsByClassName("roomNums");

    var halls = document.getElementsByClassName('waypoints');
    hallsArr = [];

    for (var i = 0; i < halls.length; i++){
      if (halls[i].value != ""){
        hallsArr.push(halls[i].value);
      }
    }

    //Ignoring empty inputs
     for (var i = 0; i < loc_inputs.length; i++) {
       if (loc_inputs[i].value != ""){
         points.push(loc_inputs[i].value);
         courseNames[i] = names_inputs[i].value;
         roomNums[i] = room_inputs[i].value;
       }
     }

     //If no inputs
     if (points.length == 0){
       window.alert('Add a class with address to Trek It');
     }

     //If only one input place marker
     if (points.length == 1 && sessionStorage.getItem('toggleBool') == "false" ){
       window.alert("only one loc");
     }

     //Else create points and calculate route
     else {
       var waypts = getPoints(points, sessionStorage.getItem('toggleBool'));
       calculateAndDisplayRoute(directionsService, directionsDisplay, waypts, sessionStorage.getItem('toggleBool'), roomNums, courseNames);
     }
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      currLoc = {
       lat: position.coords.latitude,
       lng: position.coords.longitude
      };

    var marker = new google.maps.Marker({
      position: currLoc,
      icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 4,
              strokeColor: '#00C6D7'
            },
      map: map
     });

    map.setCenter(currLoc);

   }, function() {
     handleLocationError(true, infoWindow, map.getCenter());
   });
 } else {
   // Browser doesn't support Geolocation
   handleLocationError(false, infoWindow, map.getCenter());
  }
} //End of initMap()



//Location error handler
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
 infoWindow.setPosition(pos);
 infoWindow.setContent(browserHasGeolocation ?
                       'Error: The Geolocation service failed.' :
                       'Error: Your browser doesn\'t support geolocation.');
 infoWindow.open(map);
}

//Autocomplete
function autocompleteInit(){
  var inputs = document.getElementsByClassName('waypoints');

  for (var i = 0; i < inputs.length; i++){
    var autocomplete = new google.maps.places.Autocomplete(inputs[i]);
  }
}

//
function getLocationData (position, callback) {
  var geocoder = new google.maps.Geocoder;

  if(geocoder ) {
    geocoder.geocode({'address': position }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        callback(results[0]);
      }
    });
  }
}

//Clear markers
function clearOverlays() {
  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }

  markersArray.length = 0;
}

//Set points
function getPoints(points, toggleBool){
var waypts = [];
//Set currentlocation to origin if toggle is true
  if (toggleBool == "true"){
    origin = currLoc;

    //Store waypoints into points
    for (var i = 0; i < points.length; i++) {
      //If last input
      if (i + 1 == points.length){
        destination =  points[i];
      }

      //Adding waypts
      else {
       waypts.push({
          location: points[i],
          stopover: true
        });
      }
    }
  }

  //If toggle is off
  else {
    for (var i = 0; i < points.length; i++) {
      //Adding origin
      if (i == 0){
        origin = points[i];
      }

      //Adding destination
      else if (i + 1 == points.length){
        destination =  points[i];
      }

      //Adding waypts
      else {
        waypts.push({
          location: points[i],
          stopover: true
        });
      }
    }
  }

  return waypts;
}


 //Calculate and Display route
 function calculateAndDisplayRoute(directionsService, directionsDisplay, waypts, toggleBool, roomNums, courseNames) {
   directionsService.route({
       origin: origin,
       destination: destination,
       waypoints: waypts,
       //optimizeWaypoints: true,
       travelMode: 'WALKING'
     }, function(response, status) {
       if (status === 'OK') {
         directionsDisplay.setDirections(response);
         var my_route = response.routes[0];

         clearOverlays();
         hallsArr.unshift("");
         console.log(hallsArr);

         if (toggleBool == "false") {

           //Create markers for origin + waypoints
           for (var i = 0; i < my_route.legs.length + 1; i++) {

             var scontent = null;

             //If everything input is filled out
             if (roomNums[i] != "" && courseNames[i] != ""){
               scontent = "<h5>" + courseNames[i] + "</h5>" +
                          "<p>" + hallsArr[i+1].substr(0, hallsArr[i+1].indexOf(',')) + " " + roomNums[i] + "</p>";
             }

             //If only roomNums is filled out
             else if (courseNames[i] == "" && roomNums[i] != ""){
               scontent = "<h5>" + hallsArr[i+1].substr(0, hallsArr[i+1].indexOf(','))+ "</h5>" +
               "<p>" + roomNums[i] + "</p>";
             }

             //If only courseNames is filled out
             else if (courseNames[i] != "" && roomNums[i] == ""){
              scontent = "<h5>" + courseNames[i] + "</h5>" +
                        "<p>" + hallsArr[i+1].substr(0, hallsArr[i+1].indexOf(','))+ "</p>";
             }

             //if both inputs are empty
             else {
               scontent = "<h5>" + hallsArr[i+1].substr(0, hallsArr[i+1].indexOf(','))+ "</h5>";
             }

             infoWindow = new google.maps.InfoWindow({ content: scontent});

             var pos = null;


             if (i >= my_route.legs.length) {
               pos = my_route.legs[i-1].end_location
             }

             else {
               pos = my_route.legs[i].start_location
             }

               var marker = new google.maps.Marker({
                   position: pos,
                   label: "" + (i+1),
                   map: map,
                   info: scontent
               });


               markersArray.push(marker);


               google.maps.event.addListener(marker, 'mouseover', function(){
                 infoWindow.setContent(this.info);
                 infoWindow.open(map, this);
               });

               google.maps.event.addListener(marker, 'mouseout', function(){
                 infoWindow.close();
               });
             }
           }
           else {
             //Create markers for origin + waypoints
             for (var i = 1; i < my_route.legs.length + 1; i++) {

               var scontent = null;

               //If everything input is filled out
               if (roomNums[i-1] != "" && courseNames[i-1] != ""){
                 scontent = "<h5>" + courseNames[i-1] + "</h5>" +
                            "<p>" + hallsArr[i].substr(0, hallsArr[i].indexOf(',')) + " " + roomNums[i-1] + "</p>";
               }

               //If only roomNums is filled out
               else if (courseNames[i-1] == "" && roomNums[i-1] != ""){
                 "<h5>" + hallsArr[i].substr(0, hallsArr[i].indexOf(','))+ "</h5>" +
                 "<p>" + roomNums[i-1] + "</p>";
               }

               //If only courseNames is filled out
               else if (courseNames[i-1] != "" && roomNums[i-1] == ""){
                 scontent = "<h5>" + courseNames[i] + "</h5>" +
                           "<p>" + hallsArr[i].substr(0, hallsArr[i].indexOf(','))+ "</p>";
               }

               //if both inputs are empty
               else {
                 scontent = "<h5>" + hallsArr[i].substr(0, hallsArr[i].indexOf(','))+ "</h5>";
               }

               infoWindow = new google.maps.InfoWindow({ content: scontent});

               var pos = null;


               if (i >= my_route.legs.length) {
                 pos = my_route.legs[i-1].end_location
               }

               else {
                 pos = my_route.legs[i].start_location
               }

                 var marker = new google.maps.Marker({
                     position: pos,
                     label: "" + (i),
                     map: map,
                     info: scontent
                 });


                 markersArray.push(marker);


                 google.maps.event.addListener(marker, 'mouseover', function(){
                   infoWindow.setContent(this.info);
                   infoWindow.open(map, this);
                 });

                 google.maps.event.addListener(marker, 'mouseout', function(){
                   infoWindow.close();
                 });
               }

           }

       } else {
         window.alert('Make sure your destinations are correctly inputted');
       }
     });

 }
