class CountyHealthPlan < ActiveRecord::Base
  belongs_to :county, class_name: County, inverse_of: :county_health_plans
  belongs_to :health_plan, class_name: HealthPlan, inverse_of: :county_health_plans

  validates_presence_of :county, :health_plan
  validates :county, uniqueness: { scope: :health_plan }
end
