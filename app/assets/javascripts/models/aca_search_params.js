HealthPGH.Models.AcaSearchParams = Backbone.Model.extend({
  
  defaults: {
    metal_levels: ['platinum','gold','silver','bronze','catastrophic'],
    selected_plan_id: null,
    view: null
  },

  //helps w/routing
  getSelectedPlanId: function() {
    return this.get('selected_plan_id');
  },
 
  setSelectedPlanId: function(id) {
    this.unset('selected_plan_id', {silent: !0});
    this.set({selected_plan_id: id});
  },

  getView: function() {
    return this.get('view');
  },

  setView: function(v) {
    this.set({view: v});
  },

  // helps with routing
  getMetalLevelOptions: function() {
    return this.get('metal_levels').join(",");
  },

  hasMetalLevel: function(str) {
    var s = str.toLowerCase();
    return _.find(this.get('metal_levels'), function(v) { return v == s });
  },

  toggleMetalLevel: function(metal, selected) {
    var m = this.get('metal_levels'),
      lower = metal.toLowerCase();

    if (selected) {
      m.push(lower); 
    } else {
      m = _.without(m, lower);
    }
    
    this.unset('metal_levels', {silent: !0});  
    this.set({metal_levels: _.uniq(m)});
  }

});
