class CreateProfiles < ActiveRecord::Migration[7.0]
  def change
    create_table :profiles do |t|
      t.references :user, null: false, foreign_key: true

      t.string :nickname, comment: "ニックネーム"
      t.text :bio, comment: "自己紹介文"
      t.string :x_username, comment: "Xのユーザー名"
      t.string :github_username, comment: "GitHubのユーザー名"

      t.timestamps
    end
  end
end
