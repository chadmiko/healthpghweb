HealthPGH.Views.AcaPlanComparisonView = Backbone.View.extend({
  template: JST["aca/plan-comparison"],

  className: "plan-comparison",

  collection: HealthPGH.Collections.AcaPlans,

  events: {
    "click .show-plans": "onReturnToList",
    "click .page-next" : "triggerPageAdvance",
    "click .page-back" : "triggerPageBack"
  },

  initialize: function(o) {
    this._views = [],
     this.vent = o.vent,
     this.params = o.params,
     this.collection = o.collection;

    this.page = 1;
    this.updatePlansToCompare();
    this.listenTo(this.vent, "ui:compare-page-advance", this.onPageAdvance);
    this.listenTo(this.vent, "ui:compare-page-back", this.onPageBack);
  },

  leave: function() {
    this._removeViews();
    this.remove();
  },

  triggerPageBack: function() {
    if (this.page > 1) {
      this.vent.trigger("ui:compare-page-back");
    }
  },

  triggerPageAdvance: function() {
    if (this.page < this._totalPages()) {
      this.vent.trigger("ui:compare-page-advance");
    }
  },

  onReturnToList: function() {

  },

  //Chosen to not track Compare page # in URL, b/c do we really need it?
  onPageAdvance: function() {
    this.page+= 1;
    this.render();
  },

  onPageBack: function() {
    var p = this.page - 1;
    this.page = _.max([1, p]);
    this.render();
  },

  render: function() {
    var plan1 = this._getPlan(0), 
      plan2 = this._getPlan(1),
      plan3 = this._getPlan(2),
      a = {}, b = this._attributesFor;

    a = _.extend( a, b(plan1.attributes, 'plan1_'), b(plan2.attributes, 'plan2_'), b(plan3.attributes, 'plan3_'));
    a = _.extend( a, {
      alerts: {
        plans_empty: this._plansToCompare.length == 0
      },
      current_page: this.page,
      total_pages: this._totalPages()
    });

    var h = this.template(a);
    this.$el.html( h );
    this.updateDisplay();
    return this;
  },

  getCurrentPage: function() {
    return this.page;
  },

  updateDisplay: function() {
    this.$backBtn = this.$el.find('.page-back'),
    this.$nextBtn = this.$el.find('.page-next');

    if (this.page > 1) {
      this.$backBtn.addClass('active');
    } else {
      this.$backBtn.removeClass('active');
    }

    if (this.page >= this._totalPages() || this._totalPages() == 1) {
      this.$nextBtn.removeClass('active');
    } else {
      this.$nextBtn.addClass('active');
    } 

    console.log(this.page, this._totalPages(), this.$backBtn, this.$nextBtn);

  },

  updatePlansToCompare: function() {
    var ctx = this,
      s = this.collection.where({saved: !0});

    if (s.length == 0) {
      this._plansToCompare = [];
      return;
    }

    var t = s[0].isPremiumCalculated(),
      field = ( t  ? 'net_premium' : 'metal_level_value'),
      sort_by = function(field, reverse, primer){

        var key = function (x) { return primer ? primer(x.get(field)) : x.get(field)};

        return function (a, b) {
          var x = a.get(field), y = b.get(field);

          return ( x < y ? -1 : (x > y ? 1 : 0)) * [1,-1][+!!reverse];
        }
      }

    this._plansToCompare = s.sort(sort_by( field, !1, function(x) { return x; }));
  },

  _totalPages: function() {
    return Math.ceil(this._plansToCompare.length / 3);
  },

  // YOU MUST INCLUDE TRAILING '_' on prefix!!!
  _attributesFor: function(a, prefix) {
    var h = {};
    _.each(HealthPGH.Views.AcaPlanComparisonView.ATTRIBUTES_TO_SHOW, function(k) { h[prefix+k] = a[k] });
    return h;
  },

  _getPlan: function(i) {
    var j = (this.page - 1) * 3 + i,
      c = this._plansToCompare;
    return c[j] ? c[j] : new HealthPGH.Models.AcaPlan();
  },

  _removeViews: function() {
    _.each(this._views, function(v) {
      v.leave ? v.leave() : v.remove();
    });
  }
}, {
  ATTRIBUTES_TO_SHOW: ['marketing_name', 
                        'metal_level_name', 
                        'network_type',
                        'network_url', 'net_premium', 'gross_premium']
  
      
});
