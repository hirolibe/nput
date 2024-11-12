class NoteTag < ApplicationRecord
  belongs_to :note
  belongs_to :tag, counter_cache: :notes_count

  validates :note_id, uniqueness: { scope: :tag_id, message: "同じタグ名は複数設定できません" }
end
