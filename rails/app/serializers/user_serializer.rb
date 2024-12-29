class UserSerializer < ActiveModel::Serializer
  attributes :name,
             :cheer_points,
             :cheers_count,
             :followings_count,
             :followers_count,
             :daily_durations,
             :weekly_durations,
             :monthly_durations,
             :total_duration

  has_one :profile

  has_many :notes

  def daily_durations
    (0..6).map do |i|
      day = i.days.ago.to_date
      object.durations.where(created_at: day.all_day).sum(:duration)
    end.reverse
  end

  def weekly_durations
    (0..6).map do |i|
      week_start = i.weeks.ago.beginning_of_week
      week_end = i.weeks.ago.end_of_week
      object.durations.where(created_at: week_start..week_end).sum(:duration)
    end.reverse
  end

  def monthly_durations
    (0..6).map do |i|
      month_start = i.months.ago.beginning_of_month
      month_end = i.months.ago.end_of_month
      object.durations.where(created_at: month_start..month_end).sum(:duration)
    end.reverse
  end

  def total_duration
    object.durations.sum(:duration)
  end
end
