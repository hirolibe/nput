class CreateDurations < ActiveRecord::Migration[7.0]
  def change
    create_table :durations do |t|
      t.references :user, null: false, foreign_key: true
      t.references :note, null: false, foreign_key: true

      t.integer :duration, null: false, comment: "作業時間"

      t.timestamps
    end
  end
end
