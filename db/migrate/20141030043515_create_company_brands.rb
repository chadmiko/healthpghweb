class CreateCompanyBrands < ActiveRecord::Migration
  def change
    create_table :company_brands do |t|
      t.string :name, null: false, unique: true
      t.timestamps
    end
  end
end
