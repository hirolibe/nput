class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :note

  has_many_attached :images

  validates :content, presence: true
end
