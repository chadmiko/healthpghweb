require_relative '../lib/metal_level'
require_relative '../lib/network_type'

FactoryGirl.define do
  sequence :title do |n|
    "Name#{n}"
  end

  sequence :email do |n|
    "chadmiko#{n}@gmail.com"
  end

  factory :county do
    name "WESTMORELAND"
    state_abbr "PA"
    fips_code 129
  end

  factory :issuer do
    name { generate(:title) }
    state_abbr 'PA'
  end

  factory :health_plan, aliases: [:silver_health_plan] do
    marketing_name { generate(:title) }
    plan_year 2014
    association :issuer
    metal_level MetalLevel::SILVER
    network_type GenericNetworkType::PPO
    premium_adult_individual_27 200.00
  end
end

