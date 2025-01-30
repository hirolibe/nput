class Note < ApplicationRecord
  before_create :generate_slug

  belongs_to :user

  has_many :comments, dependent: :destroy
  has_many :cheers, dependent: :destroy
  has_many :supporters, through: :cheers, source: :user
  has_many :durations, dependent: :destroy
  has_many :note_tags, dependent: :destroy
  has_many :tags, through: :note_tags

  has_many_attached :images

  enum :status, { unsaved: 10, draft: 20, published: 30 }

  validates :status, presence: true
  validates :title, :content, :published_at, presence: true, if: :published?
  validates :title, length: { maximum: 70 }
  validates :description, length: { maximum: 200 }
  validate :validate_single_unsaved
  validate :validate_durations
  validate :tag_limit

  def self.calculate_total_durations(notes)
    Duration.where(note_id: notes.map(&:id)).
      group(:note_id).
      sum(:duration)
  end

  scope :search_by_query, ->(query) {
    return all if query.blank?

    where("title LIKE ? OR content LIKE ?", "%#{query}%", "%#{query}%")
  }

  private

    def generate_slug
      self.slug = loop do
        random_slug = SecureRandom.alphanumeric(14)
        break random_slug unless Note.exists?(slug: random_slug)
      end
    end

    def validate_single_unsaved
      if unsaved? && user.notes.unsaved.exists?
        errors.add(:base, "未保存のノートは複数保有できません")
      end
    end

    def validate_durations
      if !unsaved? && durations.blank?
        errors.add(:durations, "下書きまたは公開中のノートにはデュレーションレコードが必要です")
      end
    end

    def tag_limit
      if tags.size > 5
        errors.add(:tags, "タグは5個まで設定できます")
      end
    end
end
