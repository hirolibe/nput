class Profile < ApplicationRecord
  belongs_to :user

  has_one_attached :avatar

  validates :nickname, length: { maximum: 30 }
  validates :bio, length: { maximum: 120 }
  validates :avatar, content_type: { in: %w[image/png image/jpeg image/webp],
                                     message: "はPNG、JPEG、またはWebP形式のみ対応しています" }
end
