HealthPGH.Collections.AcaPlans = Backbone.Collection.extend({
  
  model: HealthPGH.Models.AcaPlan,

  comparator: 'net_premium',

  silentlySelectForComparison: function(ids) {
    var p = this.each(function(m) { 
      var v = _.indexOf(ids, m.get('id'));
      m.set('saved', (v >= 0), {silent: !0}); 
    });
  },

  unselectCatastrophic: function() {
    _.map( this.where({metal_level_name: 'Catastrophic', saved: !0}), function(m) { m.updateSaved(!1) });
  },

  numberSaved: function() {
    return this.where({saved: !0}).length;
  }
});
