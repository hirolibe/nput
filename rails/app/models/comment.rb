class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :note

  validates :content, presence: true
end
