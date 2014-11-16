class CreateIssuers < ActiveRecord::Migration
  def change
    create_table :issuers do |t|
      t.references :brand, index: true
      t.string :name, null: false
      t.string :state_abbr, null: false, limit: 2
      t.timestamps
    end

    add_index :issuers, [:name, :state_abbr], unique: true
  end
end
