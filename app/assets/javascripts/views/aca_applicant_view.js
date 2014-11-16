HealthPGH.Views.AcaApplicantView = Backbone.View.extend({

  template: JST['aca/applicant'],

  model: HealthPGH.Models.AcaApplicant,

  events: {
    "change select[name='tobacco']" : "setTobacco",
    "keyup input[name='age']" : "setAge",
    "click .remove-applicant" : "removeItem" 
  },
 
  initialize: function() {
    this.setAge = _.debounce(this.setAge, 750);
  },
 
  setAge: function() {
    var a = parseInt( this.$el.find("input[name='age']").val() || 40);
    this.model.set('age', a);    
  },

  setTobacco: function() {
    var b = parseInt(this.$el.find("select[name='tobacco']").val());
    this.model.set({tobacco: (b == 1 ? 1 : 0 )});
  },

  removeItem: function() {
    this.collection.remove(this.model);
  },

  render: function() {
    var h = this.template(this.model.attributes);
    this.$el.html(h)
    return this;
  }
});

  
