class Note < ApplicationRecord
  belongs_to :user

  has_many :comments, dependent: :destroy
  has_many :cheers, dependent: :destroy
  has_many :supporters, through: :cheers, source: :user
  has_many :durations, dependent: :destroy
  has_many :note_tags, dependent: :destroy
  has_many :tags, through: :note_tags

  enum :status, { unsaved: 10, draft: 20, published: 30 }

  validates :status, presence: true
  validates :title, :content, :published_at, presence: true, if: :published?
  validate :validate_single_unsaved
  validate :tag_limit
  validate :validate_durations

  private

    def validate_single_unsaved
      if unsaved? && user.notes.unsaved.exists?
        errors.add(:base, "未保存のノートは複数保有できません")
      end
    end

    def tag_limit
      if tags.size > 5
        errors.add(:tags, "タグは5個まで設定できます")
      end
    end

    def validate_durations
      if !unsaved? && durations.blank?
        errors.add(:durations, "公開されたノートにはデュレーションレコードが必要です")
      end
    end
end
