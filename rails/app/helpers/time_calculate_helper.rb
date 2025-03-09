module TimeCalculateHelper
  def self.time_passed_from(reference_time)
    now = Time.current

    months = (now.year - reference_time.year) * 12 + now.month - reference_time.month - ((now.day >= reference_time.day) ? 0 : 1)
    years = months.div(12)

    return "#{years}年前" if years > 0
    return "#{months}ヶ月前" if months > 0

    seconds = (now - reference_time).round

    days = seconds / (60 * 60 * 24)
    return "#{days}日前" if days.positive?

    hours = seconds / (60 * 60)
    return "#{hours}時間前" if hours.positive?

    minutes = seconds / 60
    return "#{minutes}分前" if minutes.positive?

    "#{seconds}秒前"
  end
end
