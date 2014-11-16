Utils.Number = {
  formatFixed: function(r, n) {
    if (r ===  null || isNan(r)) return null;
    return r.fixed(n); 
  }
}
