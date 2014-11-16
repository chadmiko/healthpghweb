class Issuer < ActiveRecord::Base
  belongs_to :brand, class_name: "CompanyBrand", foreign_key: :brand_id
  has_many :plans, class_name: "HealthPlan", foreign_key: :issuer_id

  #validates :brand, presence: true
  validates :name, presence: true
  validates :state_abbr, presence: true
  validates :name, uniqueness: {scope: :state_abbr}
end
