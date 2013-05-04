app.sections.locationsList.views.LocationsList = Backbone.View.extend({

  el: "#trip-list ul",

  initialize: function() {
    _.bindAll(this, "render");
    this.collection.on("all", this.render);
  },

  render: function() {
    this.$el.html(app.templates.locationsList(this.collection.toJSON()));
  }

});