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
    header: {
      views: {}
    }
  },
  models: {},
  collections: {},
  views: {},
  templates: {}
};

$(function() {

  app.templates.locationsList = Handlebars.compile($("#tmp-locations-list").html());
  app.templates.recosList = Handlebars.compile($("#tmp-recos-list").html());

  app.collections.locationsList = new app.sections.locationsList.collections.LocationsList();
  app.collections.recosList = new app.sections.locationsList.collections.RecosList();

  app.views.locationsList = new app.sections.locationsList.views.LocationsList({
    collection: app.collections.locationsList
  });

  app.views.recosList = new app.sections.locationsList.views.RecosList({
    collection: app.collections.recosList
  });

  app.views.header = new app.sections.header.views.Header();
  app.views.dayList = new app.sections.daysList.views.DaysList({
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

  app.map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);
  directionsDisplay.setMap(app.map);

  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(app.map);

  google.maps.event.addListener(app.map, 'idle', function() {

    var request = {
      location: app.map.getCenter(),
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
        app.map.setCenter(places[0].geometry.location)
      }
  });

}

function callbackWithRoute(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    var start;
    var end;
    var waypts = [];

    app.collections.recosList.add(results);

    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createPhotoMarker(place);

     // if (i == 0) {
     //   start = place.name
     //   createPhotoMarker(place);
     // } else if (i == results.length - 1) {
     //   end = place.name
     //   createPhotoMarker(place);
     //   //google has a limit on stopover points
     // } else if (i < 8) {
     //   createPhotoMarker(place);
     //   waypts.push({
     //     location:place.name,
     //     stopover:true});
     // }
    }
    //if (!routeCalculated) {
    //  var col = app.collections.locationsList.toJSON()
    //  for (var i = 0; i < col.length; i++) {
    //    var place = col[i];
    //    //console.log(app.collections.locationsList.toJSON())
    //    if (i == 0) {
    //      start = place.name
    //      //createPhotoMarker(place);
    //    } else if (i == col.length - 1) {
    //      end = place.name
    //      //createPhotoMarker(place);
    //      //google has a limit on stopover points
    //    } else if (i < 8) {
    //      //createPhotoMarker(place);
    //      waypts.push({
    //        location:place.name,
    //        stopover:true});
    //    }
    //  }
    // calcRoute(start,end, waypts)
    // routeCalculated = true;
    //}
  }
}

app.calcRoute = function() {

  var start;
  var end;
  var waypts = [];
  var col = app.collections.locationsList.toJSON()
  console.log(col)
  for (var i = 0; i < col.length; i++) {
    var place = col[i];
      //console.log(app.collections.locationsList.toJSON())
      if (i == 0) {
        start = place.name
        //createPhotoMarker(place);
      } else if (i == col.length - 1) {
        end = place.name
        //createPhotoMarker(place);
        //google has a limit on stopover points
      } else if (i < 8) {
        //createPhotoMarker(place);
        waypts.push({
          location:place.name,
          stopover:true});
      }
    }
    calcRoute(start,end, waypts)
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
    map: app.map,
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
      infoWindow.open(app.map, marker);

      app.collections.locationsList.add({"name": result.name,
                                         "day_id": "-ItkaCb7GXbGkXWL7f9M",
                                         "lat":result.geometry.location.lat(),
                                         "lon":result.geometry.location.lng(),
                                         "rating":(result.rating || null),
                                         "address":result.vicinity,
                                         "photo":result.photos[0].getUrl({'maxWidth': 50, 'maxHeight': 50}),
                                         "type":result.types[0]
                                       });
    });
  });
}

function createMarker(place) {
  var marker = new google.maps.Marker({
    map: app.map,
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
      infoWindow.open(app.map, marker);
    });
  });
}

function addMarker() {
  var marker = new google.maps.Marker({
    position: neighborhoods[iterator],
    map: app.map,
    draggable: false,
    animation: google.maps.Animation.DROP
  });
  markers.push(marker);

  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent('test');
    infoWindow.open(app.map,marker);
  });

  iterator++;
}

google.maps.event.addDomListener(window, 'load', initialize);

//#######################################################################################




function calcRoute(start, end, waypt) {
  console.log(waypts)
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