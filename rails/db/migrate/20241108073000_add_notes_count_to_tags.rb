class AddNotesCountToTags < ActiveRecord::Migration[7.0]
  def change
    add_column :tags, :notes_count, :integer, default: 0, null: false, comment: "タグ付けされたノート数"
  end
end
