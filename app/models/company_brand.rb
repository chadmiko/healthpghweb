class CompanyBrand < ActiveRecord::Base
    
  has_many :issuers

  validates :name, presence: true
end
