HealthPGH.Collections.Checkboxes = Backbone.Collection.extend({
  model: HealthPGH.Models.Checkbox,

  comparator: 'value',

  getSelected: function() {
    _.filter(this.models, function(m) { m.isSelected(); });
  }
});
