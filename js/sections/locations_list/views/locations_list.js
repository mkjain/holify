app.sections.locationsList.views.LocationsList = Backbone.View.extend({

  el: "#trip-list",

  initialize: function() {
  },

  render: function() {
    this.$el.html(app.templates.locationsList(this.collection.toJSON()));
  }

});