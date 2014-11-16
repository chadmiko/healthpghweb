class RatingArea < ActiveRecord::Base
  #has_many :counties
  # has_many :rates, class: "HealthPlanRate", foreign_key: :rate_id
 
  validates :name, presence: true
  validates :state_abbr, presence: true
end
