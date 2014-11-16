HealthPGH.Collections.AcaPlans = Backbone.Collection.extend({
  
  model: HealthPGH.Models.AcaPlan,

  comparator: 'net_premium',

  isEmpty: function() {
    return this.length == 0;
  }
});
