HealthPGH.Views.AcaIncomeView = Backbone.View.extend({
  template: JST['aca/household-income'],

  model: HealthPGH.Models.AcaHousehold,

  events: {
    "change input[name='household_size']": "updateTaxHouseholdSize",
    "keyup input[name='household_income']": "updateTaxHouseholdIncome",
    "click #done-income": "triggerComplete"
  },

  initialize: function(o) {
    this.listenTo(this.model.applicants, "add", this.render );
    this.listenTo(this.model.applicants, "remove", this.render );
    //this.vent = o.vent;
  },

  leave: function() {
    //this.vent.off();
    this.stopListening();
    this.remove();
  },

  triggerComplete: function() {
    //this.vent.trigger("income:done", this);
  },

  updateTaxHouseholdSize: function(){
    var n = parseInt( this.$el.find("input[name='household_size']").val() );
    this.model.set('household_size', n);
  },

  updateTaxHouseholdIncome: _.debounce(function() {
    var n = this.$hhi.val().replace(/\D/g, ''),
      i = _.isEmpty(n) ? null : parseInt(n);
    
    if (n !== this.model.get('household_income')) {
      this.model.set('household_income', n);
    }
  }, 750),

  render: function() {
    var attrs = { household_income: this.model.get('household_income'), 
                 household_size: this.model.get('household_size'),
                 number_applicants: this.model.applicants.length },
      h = this.template(attrs);
    this.$el.html(h);

    this.$hhi = this.$el.find('input#household_income');
    this.$hhi.inputmask({
      groupSeparator: ",",
      rightAlign: !1,
      alias: "integer",
      autoGroup: !0
    });
    return this;
  }
});
