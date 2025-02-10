class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :note

  has_many_attached :images

  validates :content, presence: true
  validates :images, content_type: {
    in: %w[image/png image/jpeg image/webp image/gif],
    message: "はPNG、JPEG、WebPまたはGIF形式のみ対応しています",
  }, if: -> { images.attached? }
end
