HealthPGH.Views.AcaMetalLevelFiltersView = Backbone.View.extend({
  template: JST["aca/metal-level-filters"],

  model: HealthPGH.Models.AcaSearchParams,

  events: {
    "click input[type='checkbox']": "onFilterChange"
  },

  initialize: function(o) { 
    this._views = [];
    this.model = o.model;
    this.household = o.household
    this.listenTo(this.model, "change", this.onModelChange);
    //this.listenTo(this.household, "change", this.render);
  },

  leave: function() {
    this._removeViews();
    this.remove();
  },

  onFilterChange: function(ev) {
    var metal = $(ev.target).val(), 
      selected = $(ev.target).is(":checked");
    this.model.toggleMetalLevel( metal, selected );
  },
  
  onModelChange: function() {
    this.render();
  },

  _removeViews: function() {
    _.each(this._views, function(v) {
      v.leave ? v.leave() : v.remove();
    });
  },


  render: function() {
    this._removeViews();

    var a = {
      platinum: this.model.hasMetalLevel('platinum'),
      gold: this.model.hasMetalLevel('gold'),
      silver: this.model.hasMetalLevel('silver'),
      bronze: this.model.hasMetalLevel('bronze'),
      catastrophic: this.model.hasMetalLevel('catastrophic'),
      show_catastrophic: this.household.isEligibleForCatastrophicCoverage() 
    }, 
    h = this.template(a);

    this.$el.html(h);

    return this;
  }

});
