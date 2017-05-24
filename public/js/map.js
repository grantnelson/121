var map, infoWindow;
var markersArray = [];

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
         calculateAndDisplayRoute(directionsService, directionsDisplay);
       });

       // Locate user position
       if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(function(position) {
           var pos = {
             lat: position.coords.latitude,
             lng: position.coords.longitude
           };

           infoWindow.setPosition(pos);
           infoWindow.setContent('You Are Here');
           infoWindow.open(map);
           map.setCenter(pos);
         }, function() {
           handleLocationError(true, infoWindow, map.getCenter());
         });
       } else {
         // Browser doesn't support Geolocation
         handleLocationError(false, infoWindow, map.getCenter());
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

     //Clear markers
     function clearOverlays() {
      for (var i = 0; i < markersArray.length; i++ ) {
        markersArray[i].setMap(null);
      }
      markersArray.length = 0;
    }


     //Calculate and Display route
     function calculateAndDisplayRoute(directionsService, directionsDisplay) {

       var loc_inputs = document.getElementsByClassName("waypoints");
       var names_inputs = document.getElementsByClassName("courseNames");
       var room_inputs = document.getElementsByClassName("roomNums");

       var origin;
       var destination;
       var waypts = [];
       var courseNames = [];
       var roomNums = [];


       //Store waypoints into
       for (var i = 0; i < loc_inputs.length; i++) {
         if (i == 0){
           origin = loc_inputs[i].value;
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


               if (courseNames[i] != null){

                 marker['locInfo'] = new google.maps.InfoWindow({
                   content: courseNames[i] + "\nRoom: " + roomNums[i]
                 });
               }

               google.maps.event.addListener(marker, 'mouseover', function() {
                 this['locInfo'].open(map, this);
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

               google.maps.event.addListener(marker, 'mouseover', function() {
                 this['locInfo'].open(map, this);
               });

         } else {
           window.alert('Directions request failed due to ' + status);
         }
       });
     }
