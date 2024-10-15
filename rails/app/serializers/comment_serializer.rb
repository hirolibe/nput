class CommentSerializer < ActiveModel::Serializer
  attributes :id, :content, :commenter_name, :from_today
end
