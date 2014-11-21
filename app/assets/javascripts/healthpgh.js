var HealthPGH = HealthPGH || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function(data) { }
};

HealthPGH.stackTrace = function() {
    var err = new Error();
    return err.stack;
};

HealthPGH.log = function(o) {
  if (window.console && o) {
    window.console.log(o);
  }
};

HealthPGH.track = function(path) {
  ga('send', 'pageview', path);
};

var Utils = Utils || {};

window['HealthPGH'] = HealthPGH;
