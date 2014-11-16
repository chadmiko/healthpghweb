class CreateRatingAreas < ActiveRecord::Migration
  def change
    create_table :rating_areas do |t|
      t.string :name
      t.string :state_abbr

      t.timestamps
    end
  end
end
