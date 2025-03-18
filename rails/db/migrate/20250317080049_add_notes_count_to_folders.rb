class AddNotesCountToFolders < ActiveRecord::Migration[7.0]
  def change
    add_column :folders, :notes_count, :integer, default: 0, null: false, comment: "フォルダ内のノート数"
  end
end
