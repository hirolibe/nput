class CreateRelationships < ActiveRecord::Migration[7.0]
  def change
    create_table :relationships do |t|
      t.references :follower, null: false, foreign_key: { to_table: :users }, comment: "フォロー元のユーザー"
      t.references :following, null: false, foreign_key: { to_table: :users }, comment: "フォロー先のユーザー"

      t.timestamps
    end
    add_index :relationships, [:follower_id, :following_id], unique: true
  end
end
