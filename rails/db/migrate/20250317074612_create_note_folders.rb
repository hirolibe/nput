class CreateNoteFolders < ActiveRecord::Migration[7.0]
  def change
    create_table :note_folders do |t|
      t.references :note, null: false, foreign_key: true
      t.references :folder, null: false, foreign_key: true
      t.index [:note_id, :folder_id], unique: true
    end
  end
end