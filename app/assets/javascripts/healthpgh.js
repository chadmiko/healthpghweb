function stackTrace() {
    var err = new Error();
    return err.stack;
}
var Utils = Utils || {};

var HealthPGH = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function(data) { }
}
