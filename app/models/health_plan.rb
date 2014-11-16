class HealthPlan < ActiveRecord::Base
  belongs_to :issuer, foreign_key: :issuer_id
  has_many :county_health_plans, class_name: CountyHealthPlan, inverse_of: :health_plan, foreign_key: :health_plan_id
  has_many :counties, through: :county_health_plans
  has_many :cost_sharing_levels, class_name: "CostSharing"

  validates :hios_id, presence: true, uniqueness: {scope: :plan_year}
  validates :issuer, presence: true
  validates :marketing_name, presence: true
  validates :metal_level, presence: true
  validates :plan_year, presence: true
  validates :network_type, presence: true

  def default_cost_sharing_level
    cost_sharing_levels.where(level: 0).first
  end

  def benchmark_monthly_premium
    default_cost_sharing_level.premium_age_27
  end

  def cost_sharing
    if metal_level == MetalLevel::SILVER
      cost_sharing_levels
    else
      cost_sharing_levels.where(level: 0)
    end
  end

  def destroy!
    county_health_plans.map(&:destroy!)
    super
  end

  def destroy
    county_health_plans.map(&:destroy)
    super
  end
end
