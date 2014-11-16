class CostSharing < ActiveRecord::Base
  self.table_name = "cost_sharing"
  belongs_to :health_plan, inverse_of: :cost_sharing_levels
  
  validates :health_plan, presence: true
  validates :level, presence: true, uniqueness: {scope: :health_plan}

end
