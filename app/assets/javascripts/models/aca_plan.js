HealthPGH.Models.AcaPlan = Backbone.Model.extend({
  
  defaults: {
    gross_premium: null,
    net_premium: null,
    subsidy: null,
    marketing_name: '',
    issuer_name: '',
    metal_level_name: '',
    cost_sharing: [],
    cost_sharing_level: 0,
    network_url: null,
    formulary_url: null,
    saved: !1
  },

  toggleSaved: function(saved) {
    this.set({saved: (saved == !0)});
  },

  isSaved: function() {
    return this.get('saved') == !0;
  },

  getBaseRate: function() {
    return this.get('premium_age_21');
  },

  getBaseAge: function() {
    return 21;
  },

  getMetalLevelName: function() {
    return this.get('metal_level_name');
  },

  getDefaultCostSharing: function() {
    var csr = this.get('cost_sharing');
    return _.find(csr, function(h) { h['level'] == 0 });
  },

  getCurrentCostSharing: function() {
    var csr = this.get('cost_sharing'),
     level = this.get('cost_sharing_level');
    return _.find(csr, function(m) { if (m['level'] == level) return m; });
  },

  isPremiumCalculated: function() {
    var t = this.get('gross_premium');
    return !(null === t);
  },

  getIndividualDeductible: function() {
   var c = this.getCurrentCostSharing();
    return c['medical_deductible_individual'];
  },

  getFamilyDeductible: function() {
    var c = this.getCurrentCostSharing();
    return c['medical_deductible_family'];
  },

  getIndividualOOPMax: function() {
    var c = this.getCurrentCostSharing();
    return c['medical_max_oop_individual'];
  },

  getFamilyOOPMax: function() {
    var c = this.getCurrentCostSharing();
    return c['medical_max_oop_family'];
  }

});

