class ChangeNotesStatusComment < ActiveRecord::Migration[7.0]
  def change
    change_column_comment :notes, :status, "ステータス（10:未保存, 20:インプット, 30:アウトプット）"
  end
end
