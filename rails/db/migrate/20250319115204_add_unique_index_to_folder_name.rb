class AddUniqueIndexToFolderName < ActiveRecord::Migration[7.0]  # Rails のバージョンに応じて変更
  def change
    add_index :folders, :name, unique: true
  end
end
