class Folder < ApplicationRecord
  belongs_to :user

  has_many :note_folders, dependent: :destroy
  has_many :notes, through: :note_folders

  validates :folder_name, presence: true, uniqueness: true, length: { maximum: 40, message: "は40文字以内で入力してください" }

  def has_filed?(note)
    notes.exists?(id: note.id)
  end
end
