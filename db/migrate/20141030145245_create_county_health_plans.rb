class CreateCountyHealthPlans < ActiveRecord::Migration
  def change
    create_table :county_health_plans do |t|
      t.references :county, index: true
      t.references :health_plan, index: true
      t.timestamps
    end

    add_index :county_health_plans, [:county_id, :health_plan_id], unique: true
  end
end
