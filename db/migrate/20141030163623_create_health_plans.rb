class CreateHealthPlans < ActiveRecord::Migration
  def change
    create_table :health_plans do |t|
      t.references :issuer, index: true, null: false
      t.string :hios_id, null: false
      t.string :marketing_name, null: false
      t.integer :metal_level, null: false
      t.string :network_type, null: false
      t.integer :plan_year, null: false
      t.text :network_url
      t.text :summary_of_benefits_url
      t.text :formulary_url
      t.text :plan_brochure_url
      t.boolean :adult_dental
      t.boolean :child_dental
      t.decimal :premium_age_21, precision: 7, scale: 2
      t.decimal :premium_age_27, precision: 7, scale: 2
      t.timestamps
    end
      
    add_index :health_plans, :hios_id
    add_index :health_plans, [:hios_id, :plan_year], unique: true
  end
end
