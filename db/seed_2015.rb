
# About: create the plans, setup plan counties of service, then load rates by rating area

# 1) Create the plans
PLANS_FILE=File.join(Rails.root, 'files/PA-QHP_Individual_2015.csv')
qhp_parser = QHPParser.new( PLANS_FILE )
criteria = { 'State' => 'PA' }
ct = 0
headers, matches = qhp_parser.search( criteria )

matches.each do |row|
  state = row['State']

  issuer_name = row['Issuer Name']
  attrs = { hios_id: row['Plan ID - Standard Component'], 
           plan_year: YEAR, # TODO Don't hardcode this 
           marketing_name: row['Plan Marketing Name'],
           network_type: row['Plan Type'],
           metal_level: get_metal_level( row['Metal Level'] ),
           network_url: row['Network URL'], 
           plan_brochure_url: row['Plan Brochure URL'],
           summary_of_benefits_url: row['Summary of Benefits URL'],
           formulary_url: row['Drug Formulary URL'],
           adult_dental: !row['Adult Dental'].blank?,
           child_dental: !row['Child Dental'].blank?,
           premium_age_21: get_premium( row['Premium Adult Individual Age 21']),
           premium_age_27: get_premium( row['Premium Adult Individual Age 27'])
          }
  
  cost_sharing = [ get_default_csr(row) ] #, get_csr73(row), get_csr87(row), get_csr94(row) ]
  #rates = {}                   

  begin 
    issuer = Issuer.where( name: issuer_name, state_abbr: state).first_or_create!    
    plan = issuer.plans.where( hios_id: attrs[:hios_id], plan_year: YEAR).first_or_create!( attrs ) 
   
    cost_sharing.each do |level|
      plan.cost_sharing_levels.where( level: level[:level] ).first_or_create!( level )
    end

  rescue Exception => ex
    puts ex.message
    puts row.inspect
    puts plan.inspect
  end
end

# 2) Setup plan counties
SERVICE_AREA_FILE= File.join(Rails.root, 'files/PA-Service_Area_2015.csv')

qhp_parser = QHPParser.new( SERVICE_AREA_FILE )
HealthPlan.where(plan_year: YEAR).find_each do |plan|
  plan_id = plan.hios_id

  headers, matches = qhp_parser.search({'Plan ID - Standard Component' => plan_id})
  error("Duplicate plan ids in service area file", [SERVICE_AREA_FILE, matches, plan]) if matches.length > 1

  row = matches[0]
  county_names = row['Counties'].split(',')
  error("Missing counties", [plan_id, matches, county_name]) if county_names.empty?

  county_names.each do |county_name|
    county = County.where( name: county_name, state_abbr: 'PA' ).first
    error("NO COUNTY FOUND FOR #{county_name}, #{state}") unless county
    plan.county_health_plans.where(county_id: county.id).first_or_create! 
  end 
end

puts "DONE DONE DONE!!!"
# 3) Load rates for 2015 ... do this later, requires Backbone changes
#    Rely upon rates in HealthPlan for now.
