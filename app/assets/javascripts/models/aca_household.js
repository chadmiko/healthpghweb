HealthPGH.Models.AcaHousehold = Backbone.Model.extend({

  defaults: {
    household_size: 1,
    household_income: null,
    subsidy_amount: null,
    applicants: null
  },

  initialize: function(o) {
    var ctx = this;
    this.applicants = o.applicants;
    this.listenTo( this.applicants, "change", this.onApplicantChange );
    this.listenTo( this.applicants, "reset", this.onApplicantChange );
  },

  onApplicantChange: function() {
    var s = this.get('household_size'),
      l = this.applicants.length,
      n = _.max( [s, l] );

    if (s != n) {
      this.set('household_size', n);
    }

    if ( l == 0 ) {
      this.set('subsidy_amount', null);
    }
  },

  onAffordabilityChange: function() {
    
    // get ratio for family, set for each model
  },

  hasTobaccoUsers: function() { 
    return _.filter(this.applicants.models, function(m) { var s = m.get('tobacco'); return s == 1}).length > 0;
  },

  isEligibleForCatastrophicCoverage: function() {
    //don't discriminate against catastrophic when no applicants
    if(this.applicants.length == 0) return !0;

    var overs = _.filter(this.applicants.models, function(m) { var a = m.get('age'); return a > 30; });
    return overs.length == 0;    
  },

  isFamily: function() {
    return this.applicants.length > 1;
  },

  getApplicantsOverAge: function(age) {
    return _.filter(this.applicants.models, function(m) { var a = m.get('age'); return a > age; });
  },

  getApplicantsUnderAge: function(age) {
    return _.filter(this.applicants.models, function(m) { var a = m.get('age'); return a < age; });
  },
  
  isMissingSubsidy: function() {
    var n = this.get('subsidy_amount');
    return n === null;
  },

  isEmpty: function() {
    return _.isEmpty(this.applicants) || (this.applicants.length == 0);
  },

  _updateHouseholdSize: function() {
  
  } 

});
