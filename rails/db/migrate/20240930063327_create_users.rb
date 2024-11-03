class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :uid, null: false
      t.integer :cheer_points, default: 0, null: false, comment: "保有エールポイント（上限10ポイント）"

      t.timestamps

      t.index :email, unique: true
      t.index :uid, unique: true
    end
  end
end
