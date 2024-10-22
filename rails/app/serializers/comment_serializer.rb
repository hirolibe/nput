class CommentSerializer < ActiveModel::Serializer
  attributes :id, :content, :from_today

  belongs_to :user

  def from_today
    TimeCalculateHelper.time_passed_from(object.created_at)
  end
end
