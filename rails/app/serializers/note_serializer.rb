class NoteSerializer < ActiveModel::Serializer
  attributes :id,
             :title,
             :description,
             :content,
             :status_jp,
             :published_date,
             :updated_date,
             :cheers_count,
             :total_duration

  has_many :comments
  has_many :tags

  belongs_to :user, serializer: BasicUserSerializer

  def status_jp
    object.status_i18n
  end

  def published_date
    object.published_at&.strftime("%Y/%m/%d")
  end

  def updated_date
    object.updated_at.strftime("%Y/%m/%d")
  end

  def total_duration
    duration_in_seconds = object.durations.sum(:duration)
    hours = duration_in_seconds / 3600
    minutes = (duration_in_seconds % 3600) / 60
    "#{hours}時間#{minutes}分"
  end
end
