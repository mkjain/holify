"use strict";

var app = {
  sections: {
    locationsList: {
      models: {},
      collections: {},
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

  app.collections.locationsList = new app.sections.locationsList.collections.LocationsList();

  app.views.locationsList = new app.sections.locationsList.views.LocationsList({
    collection: app.collections.locationsList
  });

  app.views.locationsList.render();

  var mapOptions = {
    center: new google.maps.LatLng(37.76040136229719, -122.41928100585938),
    zoom: 10,
    minZoom: 2,
    maxZoom: 19,
    streetViewControl: false,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    },
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    panControl: false,
    zoomControl: true,
    zoomControlOptions: {
        style: google.maps.ZoomControlStyle.DEFAULT,
        position: google.maps.ControlPosition.LEFT_TOP
    },
    styles:
    [
      {
        featureType: "poi",
        elementType: "labels",
        stylers:
        [
          {
            visibility: "off"
          }
        ]
      }
    ]
  },

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
});
