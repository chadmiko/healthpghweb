HealthPGH.Views.AcaPlansView = Backbone.View.extend({
  
  template: JST["aca/plans"],

  collection: HealthPGH.Collections.AcaPlans,

  initialize: function(o) {
    this._views = [],
      this.household = o.household,
      this.collection = o.collection,
      this.params = o.params;

    this.listenTo(this.params, "change", this.render);
  },

  leave: function() {
    this._removeChildViews();
    this.remove();
  },

  plansToShow: function() {
    var ctx = this,
      s = this.collection.models.filter(function(model) {
      return (
        ctx.params.hasMetalLevel( model.get('metal_level_name') )
      );
    });

    
    if(s.length == 0) return s; 

    var t = s[0].isPremiumCalculated(),
      field = ( t  ? 'net_premium' : 'metal_level_value'),
      sort_by = function(field, reverse, primer){

      var key = function (x) { return primer ? primer(x.get(field)) : x.get(field)};
   
      return function (a, b) {
        var x = a.get(field), y = b.get(field);

        return ( x < y ? -1 : (x > y ? 1 : 0)) * [1,-1][+!!reverse];
      } 
    }

    return s.sort(sort_by( field, !1, function(x) { return x; }));
  },

  render: function() {
    this._removeChildViews();

    var h = this.template({
      number_total: this.collection.length,
      alerts: {
        found_zero_plans: this.collection.length < 1
      }
    });
    this.$el.html(h);

    this._renderPlans();
    return this;
  },

  _renderPlans: function() {
    this._removeChildViews();

    var $node = this.$el.find('.plans'),
      ctx = this;

    _.each( this.plansToShow(), function(model) {
      var v = new HealthPGH.Views.AcaPlanView({ model: model, household: ctx.household});
      v.render();
      $node.append( v.$el ); 
      ctx._views.push( v )  
    });
  },

  _sortedPlans: function(field, reverse, primer){

    var key = function (x) { return primer ? primer(x.get(field)) : x.get(field)};
 
    reverse = [-1, 1][+!!reverse];

    return function (a, b) {
      var x = key(a), y = key(b);

      return ( x < y ? -1 : (x > y ? 1 : 0)) * [1,-1][+!!reverse];
    } 
  },

  _removeChildViews: function() {
    _.each(this._views, function(v) {
      v.leave ? v.leave() : v.remove();
    });
  }

});
