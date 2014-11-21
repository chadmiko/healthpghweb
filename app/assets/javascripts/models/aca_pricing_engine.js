HealthPGH.Models.AcaPricingEngine = Backbone.Model.extend({

  initialize: function(o) {
    this.vent = o.vent;
    this.household = o.household;
    this.plans = o.plans;

    this.listenTo( this.vent, "pricing:reset", this.run );
  },

  run: function() {
    var n = this.household.applicants.length,
      plan_year = 2014,
      hh_income = this.household.get('household_income'),
      hh_size = this.household.get('household_size'),
      fpl_ratio = HealthPGH.Models.AcaPricingEngine.calculateIncomeToFPL( hh_income, hh_size, plan_year );

      // Calc HH total non-tobacco premium 

      //TODO
      //Check if household qualifies for Cost sharing boost

      //Premium cannot exceed Max allowed by HH  
    var ctx = this; 

    if (this.household.isEmpty()) {
      _.map( this.plans.models, function(m) { m.resetPricing(null, null); }); 
    } else {
      _.map(this.plans.models, function(m) { ctx.updatePlanPricing(m); }); 
    }

    this.plans.trigger("repriced");
  },

  resetPlanPricing: function(plan) {

  },

  updatePlanPricing: function( plan ) {
    var ctx = this,
      total = 0,
      subsidy_amount = null,
      base_rate = plan.getBaseRate(),
      base_age = plan.getBaseAge();

    //TODO get subsidy
    //HealthPGH.log("SUBSIDY IS: " );

    //TODO only price 5 oldest household members
    _.each( this.household.applicants.models, function(m) {

      //TODO check if tobacco user
      var smoker = !1,
        age = _.max([20, _.min([64, m.get('age')])]),
        item_rate = ctx.quoteApplicant( age, smoker, base_rate, base_age );
     
      total+= item_rate; 
    });

    plan.set({
      gross_premium: total,
      subsidy: subsidy_amount,
      net_premium: subsidy_amount ? total - subsidy_amount : total 
    });
  },

  quoteApplicant: function( age, smoker, base_rate, base_age ) {
    var curve = HealthPGH.Models.AcaPricingEngine.AGE_CURVES,
      non_smoker_rate = curve[age.toString()] / curve[base_age.toString()] * base_rate;

    // TODO adjust for smoker rates
    //HealthPGH.log( curve[age.toString()], curve[base_age.toString()], base_rate, non_smoker_rate ); 
    return non_smoker_rate; 
  }

}, {
 
  calculateIncomeToFPL: function(hh_income, hh_size, year ) {
    if( hh_income == null || hh_size == null ) {
      return null;
    }

    var fpl = HealthPGH.Models.AcaPricingEngine.calculateFPLThreshold( year, hh_size );
    return income / fpl;
  },

  calculateFPLThreshold: function( year, hh_size ) {
    var i = year || 2014;
    var base = HealthPGH.Models.AcaPricingEngine.FPL_VALUES[i]['base'],
      multiplier = HealthPGH.Models.AcaPricingEngine.FPL_VALUES[i]['multiplier'];
    return base + (hh_size * multiplier);
  },

  FPL_VALUES: {
    2014: {
      base: 7610,
      multiplier: 4060
    },
    2015: {
      base: 7610,
      multiplier: 4060
    }
  },

  AGE_CURVES: {
      20: .635,
      21: 1,
      22: 1,
      23: 1,
      24: 1,
      25: 1.004,
      26: 1.024,
      27: 1.048,
      28: 1.087,
      29: 1.119,
      30: 1.135,
      31: 1.159,
      32: 1.183,
      33: 1.198,
      34: 1.214,
      35: 1.222,
      36: 1.23,
      37: 1.238,
      38: 1.246,
      39: 1.262,
      40: 1.278,
      41: 1.302,
      42: 1.325,
      43: 1.357,
      44: 1.397,
      45: 1.444,
      46: 1.5,
      47: 1.563,
      48: 1.635,
      49: 1.706,
      50: 1.786,
      51: 1.865,
      52: 1.952,
      53: 2.04,
      54: 2.135,
      55: 2.23,
      56: 2.333,
      57: 2.437,
      58: 2.548,
      59: 2.603,
      60: 2.714,
      61: 2.81,
      62: 2.873,
      63: 2.952,
      64: 3
  }

})
