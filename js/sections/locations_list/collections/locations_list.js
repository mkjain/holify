app.sections.locationsList.collections.LocationsList = Backbone.Firebase.Collection.extend({

  model: app.sections.locationsList.models.LocationsList,

  firebase: new Firebase("https://holifirebase.firebaseio.com/attraction"),

  initialize: function() {

  }

});