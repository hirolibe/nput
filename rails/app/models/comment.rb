class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :note

  validates :content, presence: true

  def commenter_name
    user.name
  end

  def from_today
    TimeCalculateHelper.time_passed_from(created_at)
  end
end
