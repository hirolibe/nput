class NoteIndexSerializer < ActiveModel::Serializer
  attributes :id, :title, :published_at, :author_name, :from_today
  belongs_to :user, serializer: UserSerializer

  def author_name
    object.user.name
  end

  def from_today # rubocop:disable Metrics/AbcSize
    now = Time.zone.now
    published_at = object.published_at

    months = (now.year - published_at.year) * 12 + now.month - published_at.month - ((now.day >= published_at.day) ? 0 : 1)
    years = months.div(12)

    return "#{years}年前" if years > 0
    return "#{months}ヶ月前" if months > 0

    seconds = (Time.zone.now - object.published_at).round

    days = seconds / (60 * 60 * 24)
    return "#{days}日前" if days.positive?

    hours = seconds / (60 * 60)
    return "#{hours}時間前" if hours.positive?

    minutes = seconds / 60
    return "#{minutes}分前" if minutes.positive?

    "#{seconds}秒前"
  end
end
