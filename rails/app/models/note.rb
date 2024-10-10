class Note < ApplicationRecord
  belongs_to :user

  enum :status, { unsaved: 10, draft: 20, published: 30 }

  validates :title, :content, :published_at, presence: true, if: :published?
  validate :validate_single_unsaved

  def author_name
    user.name
  end

  def from_today
    now = Time.zone.now
    published_at = self.published_at

    months = (now.year - published_at.year) * 12 + now.month - published_at.month - ((now.day >= published_at.day) ? 0 : 1)
    years = months.div(12)

    return "#{years}年前" if years > 0
    return "#{months}ヶ月前" if months > 0

    seconds = (now - published_at).round

    days = seconds / (60 * 60 * 24)
    return "#{days}日前" if days.positive?

    hours = seconds / (60 * 60)
    return "#{hours}時間前" if hours.positive?

    minutes = seconds / 60
    return "#{minutes}分前" if minutes.positive?

    "#{seconds}秒前"
  end

  private

    def validate_single_unsaved
      if unsaved? && user.notes.unsaved.exists?
        errors.add(:base, "未保存の記事は複数保有できません")
      end
    end
end
