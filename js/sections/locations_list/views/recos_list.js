app.sections.locationsList.views.RecosList = Backbone.View.extend({

  el: "#recos ul",

  events: {
    "click li": "onClick"
  },

  initialize: function() {
    _.bindAll(this, "render");
    this.collection.on("all", this.render);
  },

  render: function() {
    this.$el.html(app.templates.recosList(this.collection.toJSON()));
  },

  onClick: function(event) {
    var id = $(event.currentTarget).data("id"),
        model = this.collection.get(id).toJSON();

    app.collections.locationsList.add({
      "name": model.name,
      "day_id" : "-ItkaCb7GXbGkXWL7f9M",
      "lat"    : model.geometry.location.jb,
      "lon"    : model.geometry.location.kb,
      "rating" : model.rating || null,
      "address": model.vicinity,
      "photo"  : model.photos[0].getUrl({'maxWidth': 50, 'maxHeight': 50}),
      "type"   : model.types[0]
    });
  }

});