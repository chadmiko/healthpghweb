Utils.Number = {
  formatFixed: function(r, n) {
    if (r ===  null || isNaN(r)) return null;
    return r.toFixed(n); 
  },
  rounded: function(r) {
    if (r === null || isNaN(r)) return  null;
    return Math.round(r);
  }
};

Utils.SearchRouteBuilder = {
  plans: function(ages, metal_levels, plan_id) {
    var a = [];
  },

  plan: function(ages, plan_id, metal_levels) {

  },

  application: function(ages) {

  },

  

}
