class Note < ApplicationRecord
  belongs_to :user

  has_many :comments, dependent: :destroy
  has_many :cheers, dependent: :destroy
  has_many :supporters, through: :cheers, source: :user
  has_many :durations, dependent: :destroy

  enum :status, { unsaved: 10, draft: 20, published: 30 }

  validates :status, presence: true
  validates :title, :content, :published_at, presence: true, if: :published?
  validate :validate_single_unsaved

  private

    def validate_single_unsaved
      if unsaved? && user.notes.unsaved.exists?
        errors.add(:base, "未保存のノートは複数保有できません")
      end
    end
end
