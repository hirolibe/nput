class CreateNoteTags < ActiveRecord::Migration[7.0]
  def change
    create_table :note_tags do |t|
      t.references :note, null: false, foreign_key: true
      t.references :tag, null: false, foreign_key: true

      t.index [:note_id, :tag_id], unique: true
    end
  end
end
