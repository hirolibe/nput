class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :uid, null: false
      t.string :email, null: false
      t.string :name, null: false, limit: 20
      t.integer :cheer_points, default: 0, null: false, comment: "保有エールポイント（上限50ポイント）"

      t.timestamps

      t.index :uid, unique: true
      t.index :email, unique: true
      t.index :name, unique: true
    end
  end
end
