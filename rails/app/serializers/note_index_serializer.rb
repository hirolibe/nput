class NoteIndexSerializer < ActiveModel::Serializer
  attributes :id, :title, :from_today

  belongs_to :user, serializer: UserSerializer
end
