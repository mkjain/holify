app.sections.daysList.collections.DaysList = Backbone.Firebase.Collection.extend({

  model: app.sections.locationsList.models.DaysList,

  firebase: new Firebase("https://holifirebase.firebaseio.com/days"),

  initialize: function() {

  }

});