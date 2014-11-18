HealthPGH.Collections.AcaPlans = Backbone.Collection.extend({
  
  model: HealthPGH.Models.AcaPlan,

  comparator: 'net_premium',

  selectForComparison: function(ids) {

  },

  silentlySelectForComparison: function(ids) {
    var p = this.each(function(m) { 
      var v = _.indexOf(ids, m.get('id'));
      m.set('saved', (v >= 0), {silent: !0}); 
    });
  },


  isEmpty: function() {
    return this.length == 0;
  }
});
