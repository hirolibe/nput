class UserSerializer < ActiveModel::Serializer
  attributes :id,
             :cheer_points,
             :cheers_count,
             :followings_count,
             :followers_count,
             :daily_duration,
             :monthly_duration,
             :total_duration

  has_one :profile

  def daily_duration
    object.durations.where(created_at: Time.current.all_day).sum(:duration)
  end

  def monthly_duration
    object.durations.where(created_at: Time.current.all_month).sum(:duration)
  end

  def total_duration
    object.durations.sum(:duration)
  end
end
