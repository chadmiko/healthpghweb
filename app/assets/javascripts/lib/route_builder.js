var RB = RB || {};

RB.editApplicationPath = function( household ) {
  var a = [];

  a.push("edit");

  if (!household.isEmpty()) {
    a.push( "ages:" + household.applicants.map(function(m) { return m.get('age');} ).join(",") );
  }

  return a.join("/");
};

RB.planPath = function(household, params) {
  var a = [],
    cids = params.getComparisonPlanIds();
    
  a.push( "plan" );
  a.push( params.getSelectedPlanId() );

  if (!household.isEmpty()) {
    a.push( "ages:" + household.applicants.map(function(m) { return m.get('age');} ).join(","));
  }

  if(!_.isEmpty(cids)) {
    a.push("compare:", cids.join(","));
  }
   
  console.log("PLAN", a);
 
  return a.join("/");
};

RB.filterPlansPath = function( household, params) {
  var a = [],
    excepted_metals = params.getExceptedMetalLevels();

  a.push("filter");

  if( !_.isEmpty(excepted_metals)) {
    a.push("except:" + excepted_metals.join(","));
  }

  return a.join("/");
};

RB.listPlansPath = function( household, params ){
  var a = [],
    compare_ids = params.getComparisonPlanIds(),
    excepted_metals = params.getExceptedMetalLevels();

  if( !household.isEmpty()) {
    a.push("ages:" + household.applicants.map(function(m) { return m.get('age');}).join(",")); 
  }

  if( !_.isEmpty(excepted_metals)) {
    a.push("except:" + excepted_metals);
  }

  if( compare_ids.length > 0 ) {
    a.push( "compare:" + compare_ids.join(",") )
  }

  return a.join("/");
}

RB.comparePlansPath = function( household, params ) {
  var a = [];

  a.push( "vs:" + params.getComparisonPlanIds().join(","));
    
  if (!household.isEmpty()) {
    a.push("ages:" + household.applicants.map(function(m) { return m.get('age') }).join(","));
  }

  return a.join("/");
}
