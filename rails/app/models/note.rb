class Note < ApplicationRecord
  belongs_to :user

  enum :status, { unsaved: 10, draft: 20, published: 30 }

  validates :title, :content, :published_at, presence: true, if: :published?
  validate :validate_single_unsaved

  def validate_single_unsaved
    if unsaved? && user.notes.unsaved.exists?
      errors.add(:base, "未保存の記事は複数保有できません")
    end
  end
end
