"use strict";

var app = {
  sections: {
    locationsList: {
      models: {},
      collections: {},
      views: {}
    },
    daysList:{
      models: {},
      collections: {},
      views: {}
    },
  },
  models: {},
  collections: {},
  views: {},
  templates: {}
};

$(function() {
  app.templates.locationsList = Handlebars.compile($("#tmp-locations-list").html());

  app.collections.locationsList = new app.sections.locationsList.collections.LocationsList();

  app.views.locationsList = new app.sections.locationsList.views.LocationsList({
    collection: app.collections.locationsList
  });



var berlin = new google.maps.LatLng(52.520816, 13.410186);

var neighborhoods = [
  new google.maps.LatLng(52.511467, 13.447179),
  new google.maps.LatLng(52.549061, 13.422975),
  new google.maps.LatLng(52.497622, 13.396110),
  new google.maps.LatLng(52.517683, 13.394393)
];



var markers = [];
var iterator = 0;

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var infoWindow;
var service;

var routeCalculated = false ;

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var mapOptions = {
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: berlin
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);
  directionsDisplay.setMap(map);

  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);

  google.maps.event.addListener(map, 'idle', function() {

    var request = {
      location: map.getCenter(),
      radius: '5000',
      types: ['museum']
    };
    service.nearbySearch(request, callbackWithRoute);
  });



  // search box stuff

  var input = document.getElementById('searchTextField');

  var searchBox = new google.maps.places.SearchBox(input, {
    bounds: null
  });

  google.maps.event.addListener(searchBox, 'places_changed', function() {
    routeCalculated = false;
      var places = searchBox.getPlaces();
      if (places.length != 0) {
        map.setCenter(places[0].geometry.location)
      }
  });

}

function callbackWithRoute(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    var start;
    var end;
    var waypts = [];

                console.log(results);

    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createPhotoMarker(results[i]);

      if (i == 0) {
        start = place.name
      } else if (i == results.length - 1) {
        end = place.name
        //google has a limit on stopover points
      } else if (i < 8) {
        waypts.push({
          location:place.name,
          stopover:true});
      }
    }
    if (!routeCalculated) {
     calcRoute(start,end, waypts)
     routeCalculated = true;
    }

  }
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createPhotoMarker(results[i]);
    }
  }
}

function drop() {
  for (var i = 0; i < neighborhoods.length; i++) {
    setTimeout(function() {
      addMarker();
    }, i * 200);
  }
}

function createPhotoMarker(place) {
  var photos = place.photos;
  if (!photos) {
    return;
  }

  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    title: place.name,
    icon: photos[0].getUrl({'maxWidth': 50, 'maxHeight': 50})
  });

  google.maps.event.addListener(marker, 'click', function() {
    service.getDetails(place, function(result, status) {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        alert(status);
        return;
      }
      infoWindow.setContent(result.name);
      infoWindow.open(map, marker);

      app.collections.locationsList.add({"name": result.name});
    });
  });
}

function createMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: {
      // Star
      path: 'M 0,-24 6,-7 24,-7 10,4 15,21 0,11 -15,21 -10,4 -24,-7 -6,-7 z',
      fillColor: '#ffff00',
      fillOpacity: 1,
      scale: 1/4,
      strokeColor: '#bd8d2c',
      strokeWeight: 1
    }
  });

  google.maps.event.addListener(marker, 'click', function() {
    service.getDetails(place, function(result, status) {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        alert(status);
        return;
      }
      infoWindow.setContent(result.name);
      infoWindow.open(map, marker);
    });
  });
}

function addMarker() {
  var marker = new google.maps.Marker({
    position: neighborhoods[iterator],
    map: map,
    draggable: false,
    animation: google.maps.Animation.DROP
  });
  markers.push(marker);

  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent('test');
    infoWindow.open(map,marker);
  });

  iterator++;
}

google.maps.event.addDomListener(window, 'load', initialize);

//#######################################################################################




function calcRoute(start, end, waypt) {
  //var start = 'Alexanderplatz, berlin';
  //var end = 'Potsdamer Platz, berlin';
  var waypts = [];
  var checkboxArray = document.getElementById('waypoints');
  for (var i = 0; i < neighborhoods.length; i++) {
   // if (checkboxArray.options[i].selected == true) {
     // waypts.push({
     //     location:neighborhoods[i].value,
      //    stopover:true});
    //}
  }

  var request = {
      origin: start,
      destination: end,
      waypoints: waypt,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      //var route = response.routes[0];
      //var summaryPanel = document.getElementById('directions_panel');
      //summaryPanel.innerHTML = '';
      // For each route, display summary information.
      //for (var i = 0; i < route.legs.length; i++) {
      //  var routeSegment = i + 1;
      //  summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><br>';
      //  summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
      //  summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
      //  summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
      //  }
    }
  });
}





google.maps.event.addDomListener(window, 'load', initialize);
});