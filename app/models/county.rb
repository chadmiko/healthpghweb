class County < ActiveRecord::Base
  has_many :county_health_plans
  has_many :health_plans, through: :county_health_plans, source: :health_plan

  validates :name, presence: true
  validates :state_abbr, presence: true
  validates :fips_code, presence: true, uniqueness: true
 
  scope :active, -> { where(active: true) }

  def full_name
    "#{name.titleize} County"
  end
 
  def name=(val)
    upper_val = val.to_s.upcase
    write_attribute(:name, upper_val)
  end
end
