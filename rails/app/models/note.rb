class Note < ApplicationRecord
  before_create :generate_note_slug

  belongs_to :user

  has_many :comments, dependent: :destroy
  has_many :cheers, dependent: :destroy
  has_many :supporters, through: :cheers, source: :user
  has_many :durations, dependent: :destroy
  has_many :note_tags, dependent: :destroy
  has_many :tags, through: :note_tags
  has_many :note_folders, dependent: :destroy
  has_many :folders, through: :note_folders

  has_many_attached :images

  enum :status, { unsaved: 10, draft: 20, published: 30 }

  validates :status, presence: true
  validates :title, :content, :published_at, presence: true, if: :published?
  validates :title, length: { maximum: 70 }
  validates :description, length: { maximum: 200 }
  validate :validate_single_unsaved
  validate :validate_durations
  validate :tag_limit
  validates :images, content_type: {
    in: %w[image/png image/jpeg image/webp image/gif],
    message: "はPNG、JPEG、WebPまたはGIF形式のみ対応しています",
  }, if: -> { images.attached? }

  def self.calculate_total_durations(notes)
    Duration.where(note_id: notes.map(&:id)).
      group(:note_id).
      sum(:duration)
  end

  scope :search_by_query, ->(query) {
    where("title LIKE :query OR content LIKE :query", query: "%#{sanitize_sql_like(query)}%")
  }

  scope :delete_by_query, ->(query) {
    where.not("title LIKE :query OR content LIKE :query", query: "%#{sanitize_sql_like(query)}%")
  }

  private

    def generate_note_slug
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
        errors.add(:durations, "インプットまたはアウトプットしたノートにはデュレーションレコードが必要です")
      end
    end

    def tag_limit
      if tags.size > 5
        errors.add(:tags, "タグは5個まで設定できます")
      end
    end
end
