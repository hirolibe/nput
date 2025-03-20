class Folder < ApplicationRecord
  before_create :generate_folder_slug

  belongs_to :user

  has_many :note_folders, dependent: :destroy
  has_many :notes, through: :note_folders

  validates :name, presence: true, uniqueness: true, length: { maximum: 40, message: "は40文字以内で入力してください" }

  def has_filed?(note)
    notes.exists?(id: note.id)
  end

  private

    def generate_folder_slug
      self.slug = loop do
        random_slug = SecureRandom.alphanumeric(14)
        break random_slug unless Folder.exists?(slug: random_slug)
      end
    end
end
