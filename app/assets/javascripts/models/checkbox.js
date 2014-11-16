HealthPGH.Models.Checkbox = Backbone.Model.extend({
  defaults: {
    value: null,
    label: '',
    selected: !0
  },

  isSelected: function() {
    var s = this.get('selected');
    return !_.isEmpty(s) && !0 == s; 
  }
});
