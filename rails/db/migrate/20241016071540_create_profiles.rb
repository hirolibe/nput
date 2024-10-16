class CreateProfiles < ActiveRecord::Migration[7.0]
  def change
    create_table :profiles do |t|
      t.references :user, null: false, foreign_key: true

      t.string :nickname, comment: "ニックネーム"
      t.text :bio, comment: "自己紹介文"
      t.string :firebase_avatar_url, comment: "Firebaseのアバター画像のURL"
      t.string :sns_link_x, comment: "SNSリンク（X）"
      t.string :sns_link_github, comment: "SNSリンク（GitHub）"
      t.integer :cheer_points, default: 0, comment: "保有エールポイント（上限10ポイント）"

      t.timestamps
    end
  end
end
