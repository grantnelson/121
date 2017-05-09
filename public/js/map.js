 var map, infoWindow;
      function initMap() {

        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;

        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 32.880060, lng: -117.234014},
          zoom: 15
        });
        directionsDisplay.setMap(map);
        infoWindow = new google.maps.InfoWindow;

        //Call calculate route when submit is clicked
        document.getElementById('submit').addEventListener('click', function() {
          calculateAndDisplayRoute(directionsService, directionsDisplay);
          window.alert("hello");
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

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }

      function calculateAndDisplayRoute(directionsService, directionsDisplay) {

        var loc_inputs = document.getElementsByClassName("waypoints");

        var origin;
        var destination;
        var waypts = [];

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
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }
