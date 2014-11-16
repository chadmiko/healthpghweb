HealthPGH.Models.AcaApplicant = Backbone.Model.extend({

  defaults: {
    tobacco: !1,
    age: null 
  },

  getDescription: function() {
    var t = "Age " + this.get('age').toString();
    if (this.get('tobacco') == 1) {
      t+= " (Tobacco)";
    }

    return t;
  }

});
