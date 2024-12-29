class CreateProfiles < ActiveRecord::Migration[7.0]
  def change
    create_table :profiles do |t|
      t.references :user, null: false, foreign_key: true

      t.string :nickname, limit: 30, comment: "ニックネーム"
      t.string :bio, limit: 120, comment: "自己紹介文"
      t.string :x_username, comment: "Xのユーザー名"
      t.string :github_username, comment: "GitHubのユーザー名"

      t.timestamps
    end
  end
end
