HealthPGH.Views.AcaMetalLevelFiltersView = Backbone.View.extend({
  template: JST["aca/metal-level-filters"],

  model: HealthPGH.Models.AcaSearchParams,

  events: {
    "change input[type='checkbox']": "onFilterChange"
  },

  initialize: function(o) { 
    this._views = [],
    this.model = o.model,
    this.household = o.household,
    this.vent = o.vent;
  },

  leave: function() {
    this._removeViews();
    this.remove();
  },

  onFilterChange: function(ev) {
    var metal = $(ev.target).val(), 
      selected = $(ev.target).is(":checked");

    selected == true ? this.model.includeMetalLevel( metal ) : this.model.excludeMetalLevel( metal );
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
      platinum: this.model.isMetalLevelIncluded('platinum'),
      gold: this.model.isMetalLevelIncluded('gold'),
      silver: this.model.isMetalLevelIncluded('silver'),
      bronze: this.model.isMetalLevelIncluded('bronze'),
      catastrophic: this.model.isMetalLevelIncluded('catastrophic'),
      show_catastrophic: this.household.isEligibleForCatastrophicCoverage() 
    }, 
    h = this.template(a);

    this.$el.html(h);

    return this;
  }

});
