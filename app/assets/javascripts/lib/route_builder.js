var RB = RB || {};

RB.editApplicationPath = function( household, params ) {
  var a = [];

  if (!household.isEmpty()) {
    a.push( household.applicants.map(function(m) { return m.get('age');} ).join(",") );
  }
   
  return "edit" + a.join("/");
};

RB.planPath = function(household, params) {
  var a = [];
  a.push( "plan" );
  a.push( params.getSelectedPlanId() );
  return a.join("/");
};

RB.filterPlansPath = function( household, params) {
  return "filter";
};

RB.listPlansPath = function( household, params ){
  var a = [],
    compare_ids = params.getComparisonPlanIds(); 
 
  if( !household.isEmpty()) {
    a.push('list' + household.applicants.map(function(m) { return m.get('age');}).join(",")); 
  }

  //TODO metal levels

  if( compare_ids.length > 0 ) {
    a.push( "compare" + compare_ids.join(",") )
  }

  return a.join("/");
}
