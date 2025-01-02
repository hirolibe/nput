class NoteSerializer < ActiveModel::Serializer
  attributes :id,
             :title,
             :description,
             :content,
             :cheers_count,
             :slug,
             :status_jp,
             :published_date,
             :updated_date,
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
    object.durations.sum(:duration)
  end
end
