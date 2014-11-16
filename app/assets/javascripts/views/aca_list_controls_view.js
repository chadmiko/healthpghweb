HealthPGH.Views.AcaListControlsView = Backbone.View.extend({

  template: JST["aca/list-controls"],

  events: {
  },


  initialize: function(o) {
    this.params = o.params;
    this.household = o.household;
    this.vent = o.vent;
  },

  leave: function() {
    this.remove();
  },

  render: function() {
    var h = this.template({
      empty_applicants_mode: this.household.isEmpty(),
      applicants_button_text: this.getApplicantsButtonText(),
      applicants_count: this.household.applicants.length, 
      subsidy_button_text: ''
    });
    this.$el.html(h);

    this._renderApplicantSummary();
 
    return this;
  },

  getApplicantsButtonText: function() {
    var ct = this.household.applicants.length;

    if (ct == 1 ) {
      return '1 Applicant';
    } else {
      return ct + " Applicants";
    }
  },

  _renderApplicantSummary: function() {
    var $el = this.$el.find('#applicants-summary-list');
    $el.empty();

    if( this.household.isEmpty()) {
      var h = $("<li/>").text('Add applicants');
      $el.append( h );
    } else {
      _.each(this.household.applicants.models, function(m) {
        var h = $("<li></li>").text( m.getDescription() );
        $el.append( h );
      });
    }

    $el.find('.dropdown').dropdown();
  }

});
