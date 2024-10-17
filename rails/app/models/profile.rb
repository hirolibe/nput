class Profile < ApplicationRecord
  belongs_to :user

  has_one_attached :avatar

  validates :cheer_points, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 10 }
end
