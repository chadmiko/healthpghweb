HealthPGH.Routers.AcaPlanSearch = Backbone.Router.extend({
  el: '#app-view',

  routes: {
    "": "list",
    "(ages:ages)(/)(except:metal)(/)(compare:plan_ids)": "list",
    "plan/:id(/ages:ages)(/compare:plan_ids)": "plan",
    "edit(/ages:ages)": "application",
    "filter(/except:metal)": "inputFilters",
    "vs:plan_ids(/ages:ages)": "planComparison"
  },

  initialize: function(opts) {
    this.vent = _.extend({}, Backbone.Events);
    this.county = opts.county;
    this.search_params = opts.searchParams || new HealthPGH.Models.AcaSearchParams({});
    this.applicants = new HealthPGH.Collections.AcaApplicants([]);
    this.household = new HealthPGH.Models.AcaHousehold({
                        applicants: this.applicants, 
                        params: this.search_params });

    this.plans = opts.plans || new HealthPGH.Collections.AcaPlans([]);
    this.pricingEngine = new HealthPGH.Models.AcaPricingEngine({
      household: this.household,
      plans: this.plans,
      vent: this.vent
    })

    this._startListening();
    var r = location.pathname + location.search;
    Backbone.history.start({ root: r});
  },

  list: function( ages, metal_levels, compare_ids) {
    var m = this._parseMetalLevels( metal_levels ),
      cids = this._parseCompareIds( compare_ids );

    this.household.applicants.reset( this._parseApplicants( ages ), {silent: !0});
    this.search_params.set({
      except_metal_levels:  m,
      compare_ids: cids
    }, {silent: !0});


    this.plans.silentlySelectForComparison(this.search_params.getComparisonPlanIds());

    if (!this.household.isEligibleForCatastrophicCoverage()) {      
      this.search_params.excludeMetalLevel('catastrophic');
      this.plans.unselectCatastrophic(); 
    }

    this.vent.trigger("pricing:reset");
    this.onShowList();
  },

  application: function(ages) {
    this.household.applicants.reset( this._parseApplicants(ages), {silent: !0});
    this.onShowApplication();
  },

  plan: function(plan_id, ages) {
    //var cids = this._parseCompareIds( compare_ids )

    this.search_params.set({
      selected_plan_id: plan_id,
      //compare_ids: cids
    }, {silent: !0});

    this.household.applicants.reset( this._parseApplicants(ages), {silent: !0});
    //this.plans.silentlySelectForComparison(this.search_params.getComparisonPlanIds());
    //if (!this.household.isEligibleForCatastrophicCoverage()) {      
    //  this.plans.unselectCatastrophic(); 
    //}

    this.vent.trigger("pricing:reset");
    this.onShowPlan();
  },

  inputFilters: function(excepted_metals) {

    var m = this._parseMetalLevels(excepted_metals);
    this.search_params.set({
      except_metal_levels: m
    });

    this.onShowFilters();
  },

  planComparison: function( plan_ids, ages ) {
    this.household.applicants.reset( this._parseApplicants(ages), {silent: !0});

    this.search_params.set({
      compare_ids: this._parseCompareIds(plan_ids)
    }, {silent: !0})

    
    this.plans.silentlySelectForComparison(this.search_params.getComparisonPlanIds());
    if (!this.household.isEligibleForCatastrophicCoverage()) {      
      this.plans.unselectCatastrophic(); 
    }

    this.vent.trigger("pricing:reset");
    this.onShowPlanComparison();
  },

  _parseApplicants: function(ages) {
    var a = [];

    if (!_.isEmpty(ages)) {
      a = _.map(ages.slice(1).split(","), function(p) {
        return new HealthPGH.Models.AcaApplicant({age: parseInt(p)});
      });
    }
    
    return a; 
  },

  _parseMetalLevels: function( excepted_metals ) {
    var m = [];

    if (!_.isEmpty(excepted_metals)) {
      m = excepted_metals.slice(1).split(",");
    } 

    return m;
  },

  _parseCompareIds: function(ids) {
    var a = [];
    if ("string" == (typeof ids)) {
       a = _.map( ids.slice(1).split(","), function(id) { return parseInt(id); });
    }

    return a;
  },

  onShowApplication: function() {
    var view = new HealthPGH.Views.AcaEditApplicantsView({
        params: this.search_params,
        model: this.household,
        vent: this.vent
      });

    this._swap(view);
  },

  onShowList: function()  {
    var view = new HealthPGH.Views.AcaMainView({
      vent: this.vent,
      params: this.search_params,
      county: this.county,
      plans: this.plans,
      household: this.household
    });

    this._swap(view);
  },

  onShowPlanComparison: function() {
    var view = new HealthPGH.Views.AcaPlanComparisonView({
      vent: this.vent,
      collection: this.plans, 
      params: this.search_params,
      household: this.household
    });

    this._swap(view);
  },

  onShowPlan: function() {
    var plan_id = this.search_params.getSelectedPlanId(),
      plan = _.find(this.plans.models, function(m) { var id = m.get('id'); return id == plan_id; });

    var v = new HealthPGH.Views.AcaPlanDetailView({
      vent: this.vent,
      model: plan,
      household: this.household,
      params: this.search_params
    });

    this._swap( v );
  },

  onShowFilters: function() {
    var v = new HealthPGH.Views.AcaPlanFiltersView({
      vent: this.vent,
      household: this.household,
      params: this.search_params
    });

    this._swap( v );
  },

  _startListening: function() {
    var ctx = this;

    this.listenTo(this.vent, "show:application", this.onShowApplication);
    this.listenTo(this.vent, "show:list", this.onShowList);
    this.listenTo(this.vent, "show:plan", this.onShowPlan);
    this.listenTo(this.vent, "show:comparison", this.onShowPlanComparison);
    this.listenTo(this.vent, "show:filters", this.onShowFilters);
  },

  _scrollTop: function() {
    $("html, body").animate({scrollTop: 0}, "fast");
  },

  _stopListening: function() {
    this.stopListening();
  },
 
  _swap: function(newView) {
    this._scrollTop();

    if (this.currentView && this.currentView.leave) {
      this.currentView.leave();
    }

    this.currentView = newView;
    this.currentView.render();
    $(this.el).empty().append(this.currentView.el);
  }
})
