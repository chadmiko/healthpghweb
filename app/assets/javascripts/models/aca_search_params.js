HealthPGH.Models.AcaSearchParams = Backbone.Model.extend({
  
  defaults: {
    except_metal_levels: [],
    selected_plan_id: null,
    compare_ids: []
  },

  //helps w/routing
  getSelectedPlanId: function() {
    return this.get('selected_plan_id');
  },
 
  setSelectedPlanId: function(id) {
    var s = _.clone(this.get('selected_plan_id'));

    this.set({selected_plan_id: id}, {silent: 1});
    this.trigger("change:selected_plan_id");
  },

  getComparisonPlanIds: function() {
    return this.get('compare_ids');
  },

  resetComparisonPlanIds: function(ids_array) {
    this.set({compare_ids: ids_array});
  },

  hasPlansToCompare: function() {
    var a = this.get('compare_ids');
    return _.isEmpty(a) ? !1 : (a.length > 0);
  },

  isPlanSelectedForComparison: function(id) {
    return _.indexOf(this.get('compare_ids'), id) >= 0;
  },

  updateComparisonPlan: function(id, selected) {
    var p = _.clone(this.get('compare_ids')),
      i = parseInt(id);

    if (selected ) {
      p.push( i );
    } else {
      p = _.without(p, i);
    }

    this.set({compare_ids: _.uniq(p)});
  },

  // helps with routing
  getExceptedMetalLevels: function() {
    return this.get('except_metal_levels');
  },

  isMetalLevelIncluded: function(str) {
    var s = str.toLowerCase();
    return _.indexOf(this.get('except_metal_levels'), s) < 0;
  },

  excludeMetalLevel: function(metal) {
    var m = this.get('except_metal_levels').reverse(),
      lower = metal.toLowerCase();

    m.push(lower); 
    m = _.uniq(m);

    this.set({except_metal_levels: m}, {silent: !0});
    this.trigger("change:except_metal_levels"); 
  },

  includeMetalLevel: function(metal) {
    var m = _.clone(this.get('except_metal_levels')),
      lower = metal.toLowerCase();

    m = _.uniq(_.without(m, lower));

    this.set({except_metal_levels:  m}, {silent: !0});
    this.trigger("change:except_metal_levels"); 
  }
});
