class NoteShowSerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :published_at, :updated_at, :author_name
  belongs_to :user, serializer: UserSerializer
end
