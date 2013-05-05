app.sections.locationsList.views.LocationsList = Backbone.View.extend({

  el: "#trip-list #list",

  events: {
    "click li"        : "onClick",
    "click li .remove": "onRemoveClick"
  },

  initialize: function() {
    _.bindAll(this, "render", "updateRoute");
    this.collection.on("all", this.render);
  },

  render: function(event) {
    var update = this.updateRoute;

    this.$el.html(app.templates.locationsList(this.collection.toJSON()));

    window.setTimeout(function() {
      update();
      update = $.noop;
    }.bind(this), 1000);

    window.setTimeout(function() {
      update = this.updateRoute;
    }.bind(this), 2000);
  },

  updateRoute: function() {
    app.calcRoute();
  },

  onRemoveClick: function(event) {
    var id = $(event.currentTarget).parent().data("id"),
        model = this.collection.get(id);

    event.stopPropagation();

    this.collection.remove(model);
  },

  onClick: function(event) {
    var id = $(event.currentTarget).data("id"),
        modelData = this.collection.get(id).toJSON();

    event.stopPropagation();

    app.map.panTo(new google.maps.LatLng(modelData.lat, modelData.lon));
  }

});