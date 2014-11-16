PLANS_FILE= File.join(Rails.root, 'files/PA-QHP_Individual_2014.csv')

qhp_parser = QHPParser.new( PLANS_FILE )
criteria = { 'State' => 'PA' }
ct = 0
headers, matches = qhp_parser.search( criteria )

matches.each do |row|
  state = row['State']
  county_name = row['County']

  issuer_name = row['Issuer Name']
  attrs = { hios_id: row['Plan ID - Standard Component'], 
           plan_year: 2014, # TODO Don't hardcode this 
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
  
  cost_sharing = [ get_default_csr(row), get_csr73(row), get_csr87(row), get_csr94(row) ]
  #rates = {}                   

  begin 
    issuer = Issuer.where( name: issuer_name, state_abbr: state).first_or_create!    
    plan = issuer.plans.where( hios_id: attrs[:hios_id] ).first_or_create!( attrs ) 

    county = County.where( name: county_name, state_abbr: state ).first
    puts "NO COUNTY FOUND FOR #{county_name}, #{state}" unless county
    plan.county_health_plans.where(county_id: county.id).first_or_create! if county
    
    cost_sharing.each do |level|
      plan.cost_sharing_levels.where( level: level[:level] ).first_or_create!( level )
    end

  rescue Exception => ex
    puts ex.message
    puts row.inspect
    puts county.inspect
    puts plan.inspect
  end
end
