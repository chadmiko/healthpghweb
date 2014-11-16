class CreateCostSharingLevels < ActiveRecord::Migration
  def change
    create_table :cost_sharing do |t|
      t.references :health_plan, index: true
      t.integer :level, null: false
      t.string :medical_deductible_individual
      t.string :medical_deductible_family
      t.string :drug_deductible_individual
      t.string :drug_deductible_family
      t.string :medical_max_oop_individual
      t.string :medical_max_oop_family
      t.string :drug_max_oop_individual
      t.string :drug_max_oop_family
      t.string :pcp_copay
      t.string :specialist_copay
      t.string :er_copay
      t.string :inpatient_facility
      t.string :inpatient_physician
      t.string :generic_drugs
      t.string :pfd_brand_drugs
      t.string :non_pfd_brand_drugs
      t.string :specialty_drugs
    end
  end
end
