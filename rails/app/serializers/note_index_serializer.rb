class NoteIndexSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :from_today, :cheers_count, :total_duration

  has_many :tags

  belongs_to :user, serializer: BasicUserSerializer

  def from_today
    TimeCalculateHelper.time_passed_from(object.published_at)
  end

  def total_duration
    duration_in_seconds = instance_options[:total_durations][object.id]
    hours = duration_in_seconds / 3600
    (hours < 1) ? "1h未満" : "#{hours}h"
  end
end
