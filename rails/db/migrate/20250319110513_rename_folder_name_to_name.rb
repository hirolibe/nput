class RenameFolderNameToName < ActiveRecord::Migration[7.0]
  def change
    rename_column :folders, :folder_name, :name
    remove_index :folders, name: "index_folders_on_name"
  end
end
