class Profile < ApplicationRecord
  validates :nickname, length: { maximum: 30 }
  validates :bio, length: { maximum: 120 }

  belongs_to :user

  has_one_attached :avatar
end
