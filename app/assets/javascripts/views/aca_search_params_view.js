HealthPGH.Views.AcaSearchParamsView = Backbone.View.extend({
  template: JST["aca/search-params"],

  model: HealthPGH.Models.AcaSearchParams,

  events: {
    "keyup input[name='age']": "updateAge"
  },

  updateAge: function() {
    var s = parseInt(this.$el.find('input[name="age"]').val() || 40);
    this.model.set('age', s);
    this._updateDisplay();
  },

  _updateDisplay: function() {
  },

  render: function() {
    var h = this.template(this.model.attributes);
    this.$el.html(h);
    //TODO: _.debounce("keyup input[name='age']", function(){ ctx.updateAge() }, 800);
    return this;
  }
});
