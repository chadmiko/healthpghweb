HealthPGH.Views.AcaPlanFiltersView = Backbone.View.extend({
  template: JST['aca/plan-filters'], 

  events: {
    "click .show-plans": "onShowPlans"
  },

  initialize: function(o) {
    this._views = [],
      this.params = o.params,
      this.household = o.household,
      this.vent = o.vent;

    this.listenTo(this.params, "change:except_metal_levels", this.onMetalLevelChange);
  }, 

  leave: function() {
    this._removeViews();
    this.remove();
  },

  onShowPlans: function() {
    console.log("onShowPlans PlanFiltersView");
    Backbone.history.navigate( RB.listPlansPath( this.household, this.params));
    this.vent.trigger("show:list");
  },

  onMetalLevelChange: function() {
    console.log("onMetalLevelChange PlanFiltersView");
    Backbone.history.navigate( RB.listPlansPath( this.household, this.params ));
  },

  render: function() {
    this._removeViews();
    var h = this.template({});
    this.$el.html(h);
    this._renderMetalLevelFilters();
    return this;
  },

  _renderMetalLevelFilters: function() {
    var view = new HealthPGH.Views.AcaMetalLevelFiltersView({model: this.params, household: this.household });
    view.render();
    this.$el.find('#metal-levels-view').append( view.$el );
    this._views.push( view )
  },

  _removeViews: function() {
    _.each(this._views, function(v) {
      v.leave ? v.leave() : v.remove();
    });
  }
});
