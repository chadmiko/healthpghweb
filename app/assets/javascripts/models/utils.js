Utils.Number = {
  formatFixed: function(r, n) {
    if (r ===  null || isNaN(r)) return null;
    return r.toFixed(n); 
  }
}
