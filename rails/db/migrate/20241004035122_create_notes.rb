class CreateNotes < ActiveRecord::Migration[7.0]
  def change
    create_table :notes do |t|
      t.string :title, comment: "タイトル"
      t.text :content, comment: "本文"
      t.integer :status, null: false, default: 10, comment: "ステータス（10:未保存, 20:下書き, 30:公開中）"
      t.datetime :published_at, comment: "公開日"
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
    add_index :notes, :status
    add_index :notes, :published_at
  end
end
