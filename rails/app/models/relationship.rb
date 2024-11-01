class Relationship < ApplicationRecord
  belongs_to :follower, class_name: "User", counter_cache: :followings_count
  belongs_to :following, class_name: "User", counter_cache: :followers_count

  validates :follower_id, uniqueness: { scope: :following_id, message: "すでにこのユーザーをフォローしています" }
end
