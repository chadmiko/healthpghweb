HealthPGH.Views.AcaPlanDetailView = Backbone.View.extend({

  class: 'aca-plan-detail',

  template: JST["aca/plan-detail"],

  model: HealthPGH.Models.AcaPlan,

  events: { 
    "click .show-plans": "onShowList",
    "click .add-applicants": "onAddApplicants"
  },

  initialize: function(o) {
    this.vent = o.vent,
    this.model = o.model,
    this.household = o.household,
    this.params = o.params;
    this._views = [];
  },

  leave: function() {
    this.remove();
  },

  onAddApplicants: function() {
    //this.params.setSelectedPlanId(null);
    console.log("onAddApplicants PlanDetailView");
    Backbone.history.navigate( RB.editApplicationPath( this.household, this.params));
    this.vent.trigger("show:application");
  },

  onShowList: function() {
    this.params.setSelectedPlanId(null);
    console.log("onShowList PlanDetailView");
    Backbone.history.navigate( RB.listPlansPath( this.household, this.params));
    this.vent.trigger("show:list");
  },

  getAttributes: function() {
    var is_family = this.household.isFamily(),
      cost_sharing = this.model.getCurrentCostSharing(),
      benefits = _.pick(cost_sharing, 'pcp_copay',
                                      'specialist_copay',
                                      'er_copay',
                                      'inpatient_facility',
                                      'inpatient_physician',
                                      'medical_deductible_individual',
                                      'medical_deductible_family',
                                      'medical_max_oop_individual',
                                      'medical_max_oop_family',
                                      'drug_deductible_individual',
                                      'drug_deductible_family',
                                      'generic_drugs',
                                      'pfd_brand_drugs',
                                      'non_pfd_brand_drugs',
                                      'specialty_drugs' );

    var extras = _.extend( benefits, {
        'medical_deductible': is_family ? cost_sharing['medical_deductible_family'] : cost_sharing['medical_deductible_individual'],
        'medical_max_oop': is_family ? cost_sharing['medical_max_oop_family'] : cost_sharing['medical_max_oop_individual'],
        'is_family': is_family 
      });

    var attrs = _.extend( this.model.attributes, benefits);
    return attrs;
  },

  render: function() {
    this._removeChildViews();
    var h = this.template(this.getAttributes());
    this.$el.html(h);
    this.updateDisplay();
    return this;
  },

  updateDisplay: function() {
    var $c = this.$el.find('.catastrophic-notices'),
      $c_sub = this.$el.find('.catastrophic-subsidy-notice'),
      $c_age = this.$el.find('.catastrophic-age-notice'),
      $t = this.$el.find('.tobacco-notice'),
      $p = this.$el.find('.pricing-notice'),
      $a = this.$el.find('.add-applicants-notice');
    
    //this._alertSubsidyEligible() ? 
    this._anyCatastrophicNotices() ? $c.removeClass('hide') : $c.addClass('hide');
    this._alertCatastrophicAge() ? $c_age.removeClass('hide') : $c_age.addClass('hide');
    this._alertCatastrophicSubsidy() ? $c_sub.removeClass('hide') : $c_sub.addClass('hide');
    this._alertTobacco() ? $t.removeClass('hide') : $t.addClass('hide');
    this.household.isEmpty() ? ($a.removeClass('hide'), $p.addClass('hide')) : ($a.addClass('hide'), $p.removeClass('hide'));
  },

  _anyCatastrophicNotices: function() {
    return (this._alertCatastrophicAge() || this._alertCatastrophicSubsidy());
  },

  _alertCatastrophicAge: function() {
    return (this.model.getMetalLevelName() == 'Catastrophic') && (this.household.getApplicantsOverAge(29).length > 0);
  },

  _alertCatastrophicSubsidy: function() {
    return (this.model.getMetalLevelName() == 'Catastrophic');
  },

  _alertTobacco: function() {
    return this.household.hasTobaccoUsers();
  },

  _removeChildViews: function() {
    _.each( this._views, function() {
       v.leave ? v.leave() : v.remove();
    });
  }
});
