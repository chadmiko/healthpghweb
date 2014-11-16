HealthPGH.Views.AcaPlanView = Backbone.View.extend({

  template: JST["aca/plan"],

  model: HealthPGH.Models.AcaPlan,

  className: 'aca-plan',

  events: {
  },

  initialize: function(o) {
    this.household = o.household, this.model = o.model;
  },

  getAttributesForView: function() {
    var a = this.model.attributes,
      benefits = this.model.getCurrentCostSharing(),
      show_benefits = _.pick( benefits, 
                          'medical_deductible_individual', 
                          'medical_deductible_family',
                          'medical_max_oop_individual',
                          'medical_max_oop_family',
                          'inpatient_facility', 
                          'pcp_copay' ); 
      show_benefits['medical_deductible'] = this.household.isFamily() ? show_benefits['medical_deductible_family'] : show_benefits['medical_deductible_individual'];
      show_benefits['medical_max_oop'] = this.household.isFamily() ? show_benefits['medical_max_oop_family'] : show_benefits['medical_max_oop_individual'];
    return _.extend( a, show_benefits );
  },


  render: function() {
    var h = this.template(this.getAttributesForView());
    this.$el.html(h);
    return this;
  }
});

