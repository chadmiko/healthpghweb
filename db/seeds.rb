require 'county_parser'
require 'qhp_parser'
require 'network_type'
require 'metal_level'

COUNTY_FILE= File.join(Rails.root, 'files/counties.csv')
YEAR=2015

def error(msg, to_inspect = [])
  to_inspect.each {|m| puts m.inspect }
  raise Error.new(msg)
end

def get_metal_level( str )
  str = str.strip

  case str
    when 'Bronze' then MetalLevel::BRONZE
    when 'Silver' then MetalLevel::SILVER
    when 'Gold' then MetalLevel::GOLD
    when 'Platinum' then MetalLevel::PLATINUM
    when 'Catastrophic' then MetalLevel::CATASTROPHIC
    else 
      puts "NOT FOUND METAL: #{str}"
      #raise ArgumentError.new
      nil
    end
end

def get_csr73( row )
  # Medical Deductible - individual - 73 percent,Drug Deductible - individual - 73 percent,Medical Deductible - family - 73 percent,Drug Deductible - family - 73 percent,Medical Maximum Out Of Pocket - individual - 73 percent,Drug Maximum Out of Pocket - individual - 73 percent,Medical Maximum Out of Pocket - family - 73 percent,Drug Maximum Out of Pocket - Family - 73 percent,Primary Care Physician - 73 percent,Specialist - 73 percent,Emergency Room - 73 percent,Inpatient Facility - 73 percent,Inpatient Physician - 73 percent,Generic Drugs - 73 percent,Preferred Brand Drugs - 73 percent,Non-preferred Brand Drugs - 73 percent,Specialty Drugs - 73 percent,87 Percent Actuarial Value Silver Plan Cost Sharing

  { level: 1,
    drug_deductible_individual:  row['Drug Deductible - individual - 73 percent'],
    drug_deductible_family:  row['Drug Deductible - family - 73 percent'],
    drug_max_oop_individual:  row['Drug Maximum Out of Pocket - individual - 73 percent'],
    drug_max_oop_family:  row['Drug Maximum Out of Pocket - Family - 73 percent'],
    medical_deductible_individual:  row['Medical Deductible - individual - 73 percent'],
    medical_deductible_family:  row['Medical Deductible - family - 73 percent'],
    medical_max_oop_individual:  row['Medical Maximum Out Of Pocket - individual - 73 percent'],
    medical_max_oop_family:  row['Medical Maximum Out of Pocket - family - 73 percent'],
    pcp_copay: row['Primary Care Physician - 73 percent'],
    specialist_copay: row['Specialist - 73 percent'],
    er_copay: row['Emergency Room - 73 percent'],
    inpatient_facility: row['Inpatient Facility - 73 percent'],
    inpatient_physician: row['Inpatient Physician - 73 percent'],
    generic_drugs: row['Generic Drugs - 73 percent'],
    pfd_brand_drugs: row['Preferred Brand Drugs - 73 percent'],
    non_pfd_brand_drugs: row['Non-preferred Brand Drugs - 73 percent'],
    specialty_drugs: row['Specialty Drugs - 73 percent'],
  } 
end

def get_csr87( row )
  { level: 2,
    medical_deductible_individual:  row['Medical Deductible - individual - 87 percent'],
    drug_deductible_individual:  row['Drug Deductible - individual - 87 percent'],       
    medical_deductible_family:  row['Medical Deductible - family - 87 percent'], 
    drug_deductible_family:  row['Drug Deductible - family - 87 percent'],                 
    medical_max_oop_individual:  row['Medical Maximum Out Of Pocket - individual - 87 percent'],
    medical_max_oop_family:  row['Medical Maximum Out of Pocket - family - 87 percent'],
    drug_max_oop_individual:  row['Drug Maximum Out of Pocket - individual - 87 percent'],          
    drug_max_oop_family:  row['Drug Maximum Out of Pocket - Family - 87 percent'],
    pcp_copay: row['Primary Care Physician - 87 percent'],
    specialist_copay: row['Specialist - 87 percent'],
    er_copay: row['Emergency Room - 87 percent'],
    inpatient_facility: row['Inpatient Facility - 87 percent'],
    inpatient_physician: row['Inpatient Physician - 87 percent'],
    generic_drugs: row['Generic Drugs - 87 percent'],
    pfd_brand_drugs: row['Preferred Brand Drugs - 87 percent'],
    non_pfd_brand_drugs: row['Non-preferred Brand Drugs - 87 percent'],
    specialty_drugs: row['Specialty Drugs - 87 percent']
  } 
end

def get_csr94( row )
  { level: 3,
    medical_deductible_individual:  row['Medical Deductible - individual - 94 percent'],
    medical_deductible_family:  row['Medical Deductible - family - 94 percent'], 
    medical_max_oop_individual:  row['Medical Maximum Out Of Pocket -individual - 94 percent'],
    medical_max_oop_family:  row['Medical Maximum Out of Pocket - family - 94 percent'],
    drug_deductible_individual:  row['Drug Deductible - individual - 94 percent'],       
    drug_deductible_family:  row['Drug Deductible - family - 94 percent'],                 
    drug_max_oop_individual:  row['Drug Maximum Out of Pocket - individual - 94 percent'],          
    drug_max_oop_family:  row['Drug Maximum Out of Pocket - Family  - 94 percent'],
    pcp_copay: row['Primary Care Physician - 94 percent'],
    specialist_copay: row['Specialist - 94 percent'],
    er_copay: row['Emergency Room - 94 percent'],
    inpatient_facility: row['Inpatient Facility  - 94 percent'],
    inpatient_physician: row['Inpatient Physician  - 94 percent'],
    generic_drugs: row['Generic Drugs - 94 percent'],
    pfd_brand_drugs: row['Preferred Brand Drugs - 94 percent'],
    non_pfd_brand_drugs: row['Non-preferred Brand Drugs - 94 percent'],
    specialty_drugs: row['Specialty Drugs - 94 percent']
  } 
end

def get_default_csr( row )
  { level: 0,
    drug_deductible_individual:  row['Drug Deductible - individual - standard'],
    drug_deductible_family:  row['Drug Deductible - family - standard'],
    drug_max_oop_individual:  row['Drug Maximum Out of Pocket - individual - standard'],
    drug_max_oop_family:  row['Drug Maximum Out of Pocket - Family  - standard'],
    medical_deductible_individual:  row['Medical Deductible - individual - standard'],
    medical_deductible_family:  row['Medical Deductible -family - standard'],
    medical_max_oop_individual:  row['Medical Maximum Out Of Pocket - individual - standard'],
    medical_max_oop_family:  row['Medical Maximum Out of Pocket - family - standard'],
    pcp_copay: row['Primary Care Physician  - standard'],
    specialist_copay: row['Specialist  - standard'],
    er_copay: row['Emergency Room  - standard'],
    inpatient_facility: row['Inpatient Facility  - standard'],
    inpatient_physician: row['Inpatient Physician - standard'],
    generic_drugs: row['Generic Drugs - standard'],
    pfd_brand_drugs: row['Preferred Brand Drugs - standard'],
    non_pfd_brand_drugs: row['Non-preferred Brand Drugs - standard'],
    specialty_drugs: row['Specialty Drugs - standard']
  } 
end


def get_premium( str_val )
  str_val.gsub( '$', '' ).to_f
end

def get_rating_area(str, state)
  parts = str.strip.split(' ')
  name = nil

  if parts.last =~ /\A[\d]+\z/
    name = parts.last 
  end
  puts "NOT FOUND RATING NAME: #{str}" if name.nil?

  RatingArea.where( name: name, state_abbr: state ).first_or_create!
end

county_parser = CountyParser.new( COUNTY_FILE )
criteria = { 'state_abbr' => 'PA' }
chdrs, cmatches = county_parser.search( criteria )
cmatches.each do |row|
  name_upper = row['county_name'].to_s.upcase
  state_abbr = row['state_abbr']
  fips = "#{row['state_fips']}#{row['county_fips']}"
  active = row['active'].to_s == '1'

  begin
    County.where( fips_code: fips).first_or_create!( name: name_upper, state_abbr: state_abbr, active: active )
  rescue Exception => e
    puts e.message
    puts name_upper
    puts row.inspect
  end
end


case YEAR
  when 2014
    require_relative 'seed_2014'
  when 2015
    require_relative 'seed_2015'
  else
    raise RuntimeError.new(:unknown_year_to_seed)
  end


