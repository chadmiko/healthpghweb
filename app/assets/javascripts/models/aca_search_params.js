HealthPGH.Models.AcaSearchParams = Backbone.Model.extend({
  
  defaults: {
    metal_levels: ['platinum','gold','silver','bronze','catastrophic'],
    selected_plan_id: null,
    compare_ids: [],
    view: null  //list, application, filters, compare
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
    this.unset('view', {silent: !0});
    this.set({view: v});
    //this.trigger("change:view");
  },

  getComparisonPlanIds: function() {
    return this.get('compare_ids');
  },

  resetComparisonPlanIds: function() {
    this.set({compare_ids: []});
  },

  hasPlansToCompare: function() {
    var a = this.get('compare_ids');
    return _.isEmpty(a) ? !1 : (a.length > 0);
  },

  toggleComparisonPlan: function(id, selected) {
    var p = this.get('compare_ids'),
      i = parseInt(id);

    if (selected ) {
      p.push( i );
    } else {
      p = _.without(p, i);
    }

    this.unset('compare_ids', {silent: !0});
    this.set({compare_ids: _.uniq(p)});
  },

  // helps with routing
  getMetalLevelOptions: function() {
    return this.get('metal_levels').join(",");
  },

  getMetalLevelsArray: function() {
    return this.get('metal_levels');
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
