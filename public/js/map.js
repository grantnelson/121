var map, infoWindow;
var markersArray = [];
var currLoc = null;

     //Initialize Map
     function initMap() {
       map = new google.maps.Map(document.getElementById('map'), {
         center: {lat: 32.880060, lng: -117.234014},
         zoom: 15,
         mapTypeId: google.maps.MapTypeId.ROADMAP
       });



       var directionsService = new google.maps.DirectionsService;
       var directionsDisplay = new google.maps.DirectionsRenderer({map: map, suppressMarkers: true});

      autocompleteInit();


       infoWindow = new google.maps.InfoWindow;

       //Call calculate route when submit is clicked
       document.getElementById('submit').addEventListener('click', function() {
         calculateAndDisplayRoute(directionsService, directionsDisplay, sessionStorage.getItem('toggleBool'));
       });

       // Locate user position
       if (sessionStorage.getItem('toggleBool') == "true"){
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
                scale: 4
                },
              map: map
              });
             infoWindow.open(map);
             map.setCenter(currLoc);
           }, function() {
             handleLocationError(true, infoWindow, map.getCenter());
           });
         } else {
           // Browser doesn't support Geolocation
           handleLocationError(false, infoWindow, map.getCenter());
         }
       }
     }


     //Location error handler
     function handleLocationError(browserHasGeolocation, infoWindow, pos) {
       infoWindow.setPosition(pos);
       infoWindow.setContent(browserHasGeolocation ?
                             'Error: The Geolocation service failed.' :
                             'Error: Your browser doesn\'t support geolocation.');
       infoWindow.open(map);
     }

     function autocompleteInit(){

       var inputs = document.getElementsByClassName('waypoints');

       for (var i = 0; i < inputs.length; i++){
           var autocomplete = new google.maps.places.Autocomplete(inputs[i]);
       }
     }

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


     //Calculate and Display route
     function calculateAndDisplayRoute(directionsService, directionsDisplay, toggleBool) {

       var loc_inputs = document.getElementsByClassName("waypoints");
       var names_inputs = document.getElementsByClassName("courseNames");
       var room_inputs = document.getElementsByClassName("roomNums");

       var origin;
       var destination;
       var waypts = [];
       var courseNames = [];
       var roomNums = [];

       if (loc_inputs.length == 0) {
         window.alert("Add a class to Trek It");
       }


       //Set currentlocation to origin if toggle is true
       if (toggleBool == "true"){
         origin = currLoc;

         for (var i = 0; i < loc_inputs.length; i++) {
           if (i + 1 == loc_inputs.length){
             destination =  loc_inputs[i].value
           }

           else {
             waypts.push({
               location: loc_inputs[i].value,
               stopover: true
             });
           }

           courseNames[i] = names_inputs[i].value;
           roomNums[i] = room_inputs[i].value;
         }
       }

       else {
         for (var i = 0; i < loc_inputs.length; i++) {
           if (i == 0){
             origin = loc_inputs[i].value;
             console.log("got origin");
           }

           else if (i + 1 == loc_inputs.length){
             destination =  loc_inputs[i].value
           }

           else {
             waypts.push({
               location: loc_inputs[i].value,
               stopover: true
             });
           }

           courseNames[i] = names_inputs[i].value;
           roomNums[i] = room_inputs[i].value;
         }
     }


       //Store waypoints into

       /*
       if (waypts.length == 0){

         /*getLocationData(origin, function(addr){

           var marker = new google.maps.Marker({
               position: {lat: addr.geometry.location.lat, lng: addr.geometry.location.lng},
               label:"" + 1,
               map: map
           });
           console.log("only one");
           console.log(addr.geometry.location);
           markersArray.push(marker);
        }

       else {*/

          console.log(destination);
          console.log(waypts);
          console.log(origin);

         directionsService.route({
           origin: origin,
           destination: destination,
           waypoints: waypts,
           /*optimizeWaypoints: true,*/
           travelMode: 'WALKING'
         }, function(response, status) {
           if (status === 'OK') {
             directionsDisplay.setDirections(response);
             var my_route = response.routes[0];

             clearOverlays();

             //Create markers for origin + waypoints
             for (var i = 0; i < my_route.legs.length; i++) {
                 var marker = new google.maps.Marker({
                     position: my_route.legs[i].start_location,
                     label: "" + (i+1),
                     map: map
                 });

                 markersArray.push(marker);



                 if (roomNums[i] != " " && courseNames[i] != " "){
                   marker['locInfo'] = new google.maps.InfoWindow({
                     content: courseNames[i] + "\nRoom Number: " + roomNums[i]
                   });
                 }

                 else if (courseNames[i] == ""){
                   marker['locInfo'] = new google.maps.InfoWindow({
                     content: "\nRoom Number: " + roomNums[i]
                   });
                 }

                 else if (roomsNums[i] == ""){
                   marker['locInfo'] = new google.maps.InfoWindow({
                     content: courseNames[i]
                   });
                 }

                 marker.addListener('mouseover', function() {
                   marker['locInfo'].open(map, this);
                 });

                 marker.addListener('mouseout', function(){
                   marker['locInfo'].close();
                 });
               }

               //Destination marker + infoWindow
                 var marker = new google.maps.Marker({
                   position: my_route.legs[i-1].end_location,
                   label: ""+(i+1),
                   map: map
                 });

                 markersArray.push(marker);

                 marker['locInfo'] = new google.maps.InfoWindow({
                   content: courseNames[courseNames.length - 1] + "Room: " + roomNums[roomNums.length - 1]
                 });

                 marker.addListener('mouseover', function() {
                   marker['locInfo'].open(map, this);
                 });

                 marker.addListener('mouseout', function(){
                   marker['locInfo'].close();
                 });

           } else {
             window.alert('Directions request failed due to ' + status);
           }
         });

     }
