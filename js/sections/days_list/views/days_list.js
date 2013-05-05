app.sections.daysList.views.DaysList = Backbone.View.extend({

  el: "#bottom-bar",

  initialize: function() {
    _.bindAll(this, "render");
    this.collection.on("all", this.render);
  },

  render: function() {
    this.$("li.active .count").html(this.collection.toJSON().length);
  }

});