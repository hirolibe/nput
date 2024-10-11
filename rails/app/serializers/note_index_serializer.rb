class NoteIndexSerializer < ActiveModel::Serializer
  attributes :id, :title, :author_name, :from_today
  belongs_to :user, serializer: UserSerializer
end
