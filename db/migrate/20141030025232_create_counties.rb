class CreateCounties < ActiveRecord::Migration
  def change
    create_table :counties do |t|
      t.string :name, null: false
      t.string :fips_code, null: false, limit: 5
      t.string :state_abbr, limit: 2, null: false
      t.boolean :active, default: false, null: false
    end

    add_index :counties, [:name, :state_abbr], unique: true
    add_index :counties, :fips_code, unique: true
    add_index :counties, :active
  end
end
