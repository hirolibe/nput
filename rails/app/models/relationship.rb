class Relationship < ApplicationRecord
  belongs_to :follower,
             class_name: "User",
             inverse_of: :following_relationships,
             counter_cache: :followings_count

  belongs_to :following,
             class_name: "User",
             inverse_of: :follower_relationships,
             counter_cache: :followers_count

  validates :follower_id, uniqueness: { scope: :following_id, message: "すでにこのアカウントをフォローしています" }
end
