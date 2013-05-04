app.sections.locationsList.views.RecosList = Backbone.View.extend({

  el: "#recos",

  initialize: function() {
    _.bindAll(this, "render");
    this.collection.on("all", this.render);
  },

  render: function() {
    this.$el.html(app.templates.recosList(this.collection.toJSON()));
  }

});