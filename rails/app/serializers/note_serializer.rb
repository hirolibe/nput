class NoteSerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :status_jp, :published_date, :updated_date

  belongs_to :user, serializer: UserSerializer

  def status_jp
    object.status_i18n
  end

  def published_date
    object.published_at&.strftime("%Y/%m/%d")
  end

  def updated_date
    object.updated_at.strftime("%Y/%m/%d")
  end
end
