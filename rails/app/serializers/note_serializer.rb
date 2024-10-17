class NoteSerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :status_jp, :published_date, :updated_date

  belongs_to :user, serializer: UserSerializer
end
