HealthPGH.Routers.AcaPlanSearch = Backbone.Router.extend({
  el: '#app-view',

  routes: {
    "": "setup",
    "(a:applicants)(/metal:metal)(/plan:id)(/v:view)": "main",
    //some hacks to pass metals or selected w/o preceding param(s)
    "(a:applicants)(metal:metal)(/plan:id)": "main"
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

  main: function(ages, metal_levels, plan_id, view) {
    this._stopListening();
    this.search_params.set({
      metal_levels: metal_levels ? metal_levels.slice(1).split(",") : [],
      selected_plan_id: plan_id ? plan_id.slice(1) : null,
      view: view ? view.slice(1) : null
    });

    if (!_.isEmpty(ages)) {
      var applicants = _.map(ages.slice(1).split(","), function(p) {
        return new HealthPGH.Models.AcaApplicant({age: parseInt(p)});
      });
      this.household.applicants.reset(applicants);
    }

    this._initView();
    this._startListening();
  },

  setup: function() {
    this._initView();
  },

    // TODO Improve this madness
  _initView: function() {
    var v = this.search_params.getView();

    if (v == 'application') {
      this._showApplicationView();

    } else if(v == 'filters') {

      this._showFiltersView();

    } else {
      var pid = this.search_params.getSelectedPlanId();

      if (pid) {
        this._showPlanView();
      } else {
        this._showListView();
      }
    }
  },

  _update: function() {
    var parts = [],
      applicants = _.map(this.household.applicants.models, function(m) { return m.get('age'); }),
      metal_opts = this.search_params.getMetalLevelOptions(),
      plan_id = this.search_params.getSelectedPlanId(),
      view = this.search_params.getView();

    if (!_.isEmpty(applicants)) { parts.push( "a:" + applicants.join(",") ); }
    if (!_.isEmpty(metal_opts)) { parts.push( "metal:" + metal_opts ); }
    if (plan_id) { parts.push( "plan:" + plan_id.toString() ); }
    if (view) { parts.push( "v:" + view.toString()); }

    var route = parts.join("/");
    //console.log( "UPDATING", route);
    this.navigate( route );
  },

  _showApplicationView: function() {
    var view = new HealthPGH.Views.AcaEditApplicantsView({
        params: this.search_params,
        model: this.household,
        vent: this.vent
      });

    this._update();
    this._scrollTop();
    this._swap(view);
  },

  _showListView: function()  {
    var view = new HealthPGH.Views.AcaMainView({
      vent: this.vent,
      params: this.search_params,
      county: this.county,
      plans: this.plans,
      household: this.household
    });

    this._update();
    this._scrollTop();
    this._swap(view);
  },

  _showPlanView: function() {
    var plan_id = this.search_params.getSelectedPlanId(),
      plan = _.find(this.plans.models, function(m) { var id = m.get('id'); return id == plan_id; });

    var v = new HealthPGH.Views.AcaPlanDetailView({
      vent: this.vent,
      model: plan,
      household: this.household,
      params: this.search_params
    });

    this._update();
    this._scrollTop();
    this._swap( v );
  },

  _showListOrPlan: function() {
    var id = this.search_params.getSelectedPlanId();
    (id) ? this._showPlanView() : this._showListView();
  },

  _showFiltersView: function() {

  },

  _startListening: function() {
    var ctx = this;

    // update route when adding/removing and applicant 
    //this.listenTo(this.household.applicants, "add", ctx._update);
    //this.listenTo(this.household.applicants, "remove", ctx._update);

    //this.listenTo(this.household.applicants, "reset", ctx._update);
    //this.listenTo(this.search_params, "change", ctx._update);

    // change view on click events
    this.listenTo(this.vent, "show:application", ctx._showApplicationView);
    this.listenTo(this.vent, "show:list", ctx._showListView);
    this.listenTo(this.vent, "show:list_or_plan", ctx._showListOrPlan);
    this.listenTo(this.vent, "show:plan", ctx._showPlanView);

  },

  _scrollTop: function() {
    $(window).scrollTop(0);
  },

  _stopListening: function() {
    this.stopListening();
  },
 
  _swap: function(newView) {

    if (this.currentView && this.currentView.leave) {
      this.currentView.leave();
    }

    this.currentView = newView;
    this.currentView.render();
    $(this.el).empty().append(this.currentView.el);
  }
})
