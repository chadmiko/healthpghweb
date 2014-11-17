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

    //this.listenTo(this.household.applicants, "add", this.render);
    //this.listenTo(this.household.applicants, "remove", this.render);
    //this.listenTo(this.household.applicants, "reset", this.render);
    this.listenTo(this.params, "change:metal_levels", this.onMetalLevelChange);
    this.listenTo(this.params, "change:compare_ids", this.onComparisonChange);
  },

  leave: function() {
    this._removeViews();
    this.remove();
  },

  onPlanClick: function(ev) {
    ev.preventDefault();
    var plan_id = $(ev.target).data('id');
    this.params.setSelectedPlanId( plan_id );
    Backbone.history.navigate("plan/" + plan_id);
    this.vent.trigger("show:plan");
  },

  onShowApplication: function(ev) {
    Backbone.history.navigate( RB.editApplicationPath(this.household, this.params) );
    this.vent.trigger("show:application");
  },

  onRefine: function(ev) {
    this.params.setSelectedPlanId(null);
    this.params.resetComparisonPlanIds();
    Backbone.history.navigate( RB.filterPlansPath( this.household, this.params ));
    this.vent.trigger("show:filters");
  },

  onComparisonChange: function() {
    this.updateComparisonDisplay();
    Backbone.history.navigate( RB.listPlansPath( this.household, this.params ));
  },

  onMetalLevelChange: function() {

  },

  render: function() {
    this._removeViews();
 
    //reset template
    var h = this.template({
      county_name: this.county.full_name,
      alerts: {
        skipped_medicare_eligibles: !1,
        skipped_chip_eligibles: !1 
      },
    });

    this.$el.html(h);
    this.$el.find('.affix-list-controls').affix({
      offset: { 
        top: $('.navbar-default').height()
      }
    });

    if( !this.plans.isEmpty() ) {
      this._renderListControls();
    }
    this._renderPlans();
    this._renderMetalLevelFilters();
    this.updateComparisonDisplay();
 
    return this;
  },

  updateComparisonDisplay: function() {
    var j = this.params.getComparisonPlanIds().length;

    if (!this.$compareBtn) {
      this.$compareBtn = this.$el.find('#compare_plans');
      this.$compareBadge = this.$compareBtn.find('.badge');
    }
    this.$compareBadge.text( j );
    
    if (j > 0) {
      this.$compareBtn.removeClass('hide');
    } else {
      this.$compareBtn.addClass('hide');
    }

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
 
});
