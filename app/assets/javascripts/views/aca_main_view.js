HealthPGH.Views.AcaMainView = Backbone.View.extend({

  template: JST["aca/main"],

  events: {
    "click #new_application": "onShowApplication",
    "click button.edit-application": "onShowApplication",
    "click #refine": "onRefine",
    "click .plan": "onPlanClick"
  },


  initialize: function(o) {
    this._views = [],
    this.params = o.params,
    this.household = o.household,
    this.plans = o.plans,
    this.county = o.county;
    this.vent = o.vent;

    this.listenTo(this.household.applicants, "add", this.render);
    this.listenTo(this.household.applicants, "remove", this.render);
    this.listenTo(this.household.applicants, "reset", this.render);
  },

  leave: function() {
    this._removeViews();
    this.stopListening();
    this.remove();
  },

  onPlanClick: function(ev) {
    ev.preventDefault();
    var plan_id = $(ev.target).data('id');
    this.params.setView(null);
    this.params.setSelectedPlanId( plan_id );
    this.vent.trigger("show:plan");
  },

  onShowApplication: function(ev) {
    this.params.setView('application');
    this.vent.trigger("show:application");
  },

  onRefine: function(ev) {
    this.params.setSelectedPlanId(null);
    this.params.setView('filters');
    this.vent.trigger("show:filters");
  },

  render: function() {
    this._removeViews();
 
    //reset template
    var h = this.template({
      county_name: this.county.full_name,
      alerts: {
        skipped_medicare_eligibles: !1,
        skipped_chip_eligibles: !1 
      }
    });
    this.$el.html(h);

    if( !this.plans.isEmpty() ) {
      this._renderListControls();
    }
    this._renderPlans();
    this._renderMetalLevelFilters();
 
    return this;
  },

  _getPlansElement: function() {
    return this.$el.find('#plans-view');
  },

  _getControlsElement: function() {
    return this.$el.find('#list-controls-view');
  },
 
  _getMetalLevelsElement: function() {
    return this.$el.find('#metal-levels-view');
  }, 

  _renderSubsidy: function() {
    this._removeViews();


    this.$el.empty().append(v.$el);
  },

   _renderListControls: function() {
    var view = new HealthPGH.Views.AcaListControlsView({
        params: this.params,
        household: this.household,
        vent: this.vent
      });

    view.render();
    this._getControlsElement().append( view.$el );
    this._views.push(view);
  },

  _renderPlans: function() {
    var view = new HealthPGH.Views.AcaPlansView({
        params: this.params,
        collection: this.plans,
        household: this.household
      });

      view.render();
      this._getPlansElement().append( view.$el );

      this._views.push(view);
  },

  _renderMetalLevelFilters: function() {
    var view = new HealthPGH.Views.AcaMetalLevelFiltersView({model: this.params, household: this.household });
  
    view.render();
    this._getMetalLevelsElement().append( view.$el );
    this._views.push( view )
  },

  _removeViews: function() {
    _.each(this._views, function(v) {
      v.remove();
    });
  },

  swap: function(newView) {

    if (this.currentView && this.currentView.leave) {
      this.currentView.leave();
    }

    this.currentView = newView;
    this.currentView.render();
    $(this.el).empty().append(this.currentView.el);
  }

});
