class CreateFolders < ActiveRecord::Migration[7.0]
  def change
    create_table :folders do |t|
      t.references :user, null: false, foreign_key: true
      t.string :folder_name, null: false, comment: "フォルダ名"

      t.timestamps

      t.index :folder_name, unique: true
    end
  end
end
