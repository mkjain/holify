app.sections.locationsList.collections.LocationsList = Backbone.Firebase.Collection.extend({

  model: app.sections.locationsList.models.Locations,

  firebase: new Firebase("https://holifirebase.firebaseio.com/attraction"),

  initialize: function() {

  }

});