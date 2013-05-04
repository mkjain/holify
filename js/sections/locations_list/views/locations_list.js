app.sections.locationsList.views.LocationsList = Backbone.View.extend({

  el: "#trip-list",

  template: app.templates.locationsList,

  initialize: function() {
    // console.log(app.templates.locationsList);
  },

  render: function() {
    console.log(this);
    //this.$el.html(this.template(this.model.toJSON()));
  }

});