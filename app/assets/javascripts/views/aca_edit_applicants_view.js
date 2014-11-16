HealthPGH.Views.AcaEditApplicantsView = Backbone.View.extend({
  template: JST["aca/edit-applicants-view"],

  className: 'edit-applicants',

  model: HealthPGH.Models.AcaHousehold,

  events: {
    "click button.application-complete": "onApplicationComplete",
    "click #add_applicant": "onAddApplicant"
  },

  initialize: function(o) {
    this._views = [],
      this.model = o.model,
      this.vent = o.vent,
      this.params = o.params;

    this.listenTo(this.model.applicants, 'add', this._addItem);
    this.listenTo(this.model.applicants, 'remove', this._removeItem);
    this.listenTo( this.model.applicants, "reset", this.render );
    this.listenTo( this.model.applicants, "change", this._updateView);
  },
 
  leave: function() {
    this._removeViews();
    this.remove();
  },

  onApplicationComplete: function() {
    this.params.setView(null);
    this.vent.trigger("show:list_or_plan");
  },

  onAddApplicant: function() {
    var age = this.model.applicants.length > 1 ? '19' : '40';
    this.model.applicants.add({age: age, tobacco: !1, collection: this.model.applicants});
    this._updateView();
  },

  _updateView: function() {
    if (this.model.isEmpty()) {
      this.$el.find('#application_complete').addClass('hide');
    } else {
      this.$el.find('#application_complete').removeClass('hide');
    }

    if (this.model.applicants.length > 4) {
      this.$el.find('.max-applicants-notice').addClass('hide');
    } else {
      this.$el.find('.max-applicants-notice').removeClass('hide');
    } 

    var adults = this.model.getApplicantsOverAge(26);
    console.log(adults);
    if (adults && adults.length > 2) {
      this.$el.find('.max-adults-notice').removeClass('hide');
    } else {
      this.$el.find('.max-adults-notice').addClass('hide');
    }

    var medicare = this.model.getApplicantsOverAge(64);
    if (medicare && medicare.length > 0) {
      this.$el.find('.medicare-notice').removeClass('hide');
    } else { 
      this.$el.find('.medicare-notice').addClass('hide');
    }

    var chip = this.model.getApplicantsUnderAge(19);
    if (chip && chip.length > 0) {
      this.$el.find('.chip-notice').removeClass('hide');
    } else { 
      this.$el.find('.chip-notice').addClass('hide');
    }

    if (this.model.applicants.length > 8) {
      this.$el.find('#add_applicant').addClass('hide');
    } else {
      this.$el.find('#add_applicant').removeClass('hide');
    }

  },

  render: function() {
    this._removeViews();
    this._resetTemplate();
    this._renderCollection();
    this._updateView();
    return this;
  },

  _addItem: function(model) {
    var l = this.$el.find('tbody');
    var $div = $("<tr/>").appendTo( l );

    // set model number 
    var n = this.model.applicants.indexOf(model) + 1;
    model.set('number', n);

    var stub = new HealthPGH.Views.AcaApplicantView({
      el: $div,
      model: model,
      collection: this.model.applicants
    });

    this._views.push( stub );
    stub.render();
    this.$thead.removeClass('hide');
    this._updateView();
  },

  _removeItem: function(target) {
    var found = _.find(this._views, function(v) {
      return v.model == target;
    });

    this._views = _.without(this._views, found);
    found.remove();

    var n = 1;
    this.model.applicants.each(function(model) {
      model.set('number', n);
      n++;
    });
    this.vent.trigger("pricing:reset");
  
    this.render();
  },

  _resetTemplate: function() {
    var tpl = this.template();
    this.$el.html(tpl);
    this.$thead = this.$el.find('thead');
    this.$btn_finished = this.$el.find('#application_complete');
  },

  _renderCollection: function() {
    var ctx = this;
    this.model.applicants.each(function(m) {
      ctx._addItem(m);
    });
  },

  _removeViews: function() {
    _.each(this._views, function(v) {
      v.remove();
    });
  }

});
