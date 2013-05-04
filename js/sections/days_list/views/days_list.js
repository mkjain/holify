app.sections.daysList.views.DaysList = Backbone.View.extend({

  el: "#day-list",

  initialize: function() {
    _.bindAll(this, "render");
    this.collection.on("all", this.render);
  },

  render: function() {
    this.$el.html(app.templates.daysList(this.collection.toJSON()));
  }

});