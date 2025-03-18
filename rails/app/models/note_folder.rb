class NoteFolder < ApplicationRecord
  belongs_to :note
  belongs_to :folder, counter_cache: :notes_count

  validates :note_id, uniqueness: { scope: :folder_id, message: "このノートはすでにフォルダ内にあります" }
end
