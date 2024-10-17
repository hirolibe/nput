class CommentSerializer < ActiveModel::Serializer
  attributes :id, :content, :from_today

  belongs_to :user, serializer: UserSerializer
end
