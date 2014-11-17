HealthPGH.Routers.AcaPlanSearch = Backbone.Router.extend({
  el: '#app-view',

  routes: {
    "": "main",
    "(list:ages)(/metal:metal)(/plan:id)(/compare:plan_ids)": "main",
    //"compare:ids(/a:applicants)": "compare"
    "plan/:id(/ages:ages)(/compare:plan_ids)": "plan",
    "edit(:ages)": "application",
    "filter": "inputFilters"
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

  main: function( ages, metal_levels, plan_id, compare_ids) {

    //this._stopListening();

    var m = this._parseMetalLevels( metal_levels );

    //TODO ensure plans to compare are set to saved! 
    this.search_params.set({
      metal_levels:  m,
      selected_plan_id: plan_id ? plan_id.slice(1) : null,
      compare_ids: compare_ids ? _.uniq(compare_ids.slice(1).split(",")) : []
    }, {silent: !0});

    this.household.applicants.reset( this._parseApplicants( ages ));

    //this._startListening();
    this.onShowList();
  },

  application: function(ages) {
    this.household.applicants.reset( this._parseApplicants(ages));
    this.onShowApplication();
  },

  plan: function(plan_id, ages, compare_ids) {
    console.log("PLAN");

    this.search_params.set({
      selected_plan_id: plan_id
    });

    this.household.applicants.reset( this._parseApplicants(ages));
    var c_ids = this._parseCompareIds( compare_ids )
    this.onShowPlan();
  },

  inputFilters: function() {
    this.onShowFilters();
  },

  _parseApplicants: function(ages) {
    var a = [];

    if (!_.isEmpty(ages)) {
      a = _.map(ages.split(","), function(p) {
        return new HealthPGH.Models.AcaApplicant({age: parseInt(p)});
      });
    }
    
    return a; 
  },

  _parseMetalLevels: function( metal_levels ) {
    //don't set metal levels to empty array just because none were passed in
    var m = null;
    if (!_.isEmpty(metal_levels)) {
      m = _.uniq(metal_levels.slice(1).split(","));
    } else {
      m = this.search_params.getMetalLevelsArray();
    } 

    return m;
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
    console.log("LIST");
    var view = new HealthPGH.Views.AcaMainView({
      vent: this.vent,
      params: this.search_params,
      county: this.county,
      plans: this.plans,
      household: this.household
    });

    this._swap(view);
  },

  onShowComparison: function() {
    var ids = this.search_params.getComparisonIds(),
      plans = this.plans.filter(function(m) { var id = m.get('id'); return _.indexOf(ids, id) >= 0 ? true : false;});
    console.log(ids, plans);

    var v = new HealthPGH.Views.AcaPlanComparisonView({
      vent: this.vent,
      plans: plans, 
      household: this.household,
      params: this.search_params
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
    console.log("START");

    this.listenTo(this.vent, "show:application", this.onShowApplication);
    this.listenTo(this.vent, "show:list", this.onShowList);
    this.listenTo(this.vent, "show:plan", this.onShowPlan);
    this.listenTo(this.vent, "show:comparison", this.onShowComparison);
    this.listenTo(this.vent, "show:filters", this.onShowFilters);
  },

  _scrollTop: function() {
    $(window).scrollTop(0);
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
