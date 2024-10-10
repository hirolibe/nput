class NoteIndexSerializer < ActiveModel::Serializer
  attributes :id, :title, :published_at, :author_name, :from_today
  belongs_to :user, serializer: UserSerializer
end
