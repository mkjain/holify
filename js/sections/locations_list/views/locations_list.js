app.sections.locationsList.views.LocationsList = Backbone.View.extend({

  el: "#trip-list #list",

  events: {
    "click li .remove": "onClick"
  },

  initialize: function() {
    _.bindAll(this, "render");
    this.collection.on("all", this.render);
  },

  render: function() {
    this.$el.html(app.templates.locationsList(this.collection.toJSON()));
  },

  onClick: function(event) {
    var id = $(event.currentTarget).parent().data("id"),
        model = this.collection.get(id);


    model.destroy();
  }

});