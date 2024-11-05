class User < ApplicationRecord
  validates :email, presence: true, uniqueness: true
  validates :uid, presence: true, uniqueness: true
  validates :cheer_points, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 10 }

  has_many :notes, dependent: :destroy

  has_many :comments, dependent: :destroy

  has_many :cheers, dependent: :destroy
  has_many :cheered_notes, through: :cheers, source: :note

  has_many :following_relationships,
           class_name: "Relationship",
           foreign_key: :follower_id,
           dependent: :destroy,
           inverse_of: :follower
  has_many :followings, through: :following_relationships, source: :following

  has_many :follower_relationships,
           class_name: "Relationship",
           foreign_key: :following_id,
           dependent: :destroy,
           inverse_of: :following
  has_many :followers, through: :follower_relationships, source: :follower

  has_many :durations, dependent: :destroy

  has_one :profile, dependent: :destroy

  after_create :create_profile!

  def has_cheered?(note)
    cheers.exists?(note:)
  end

  def has_followed?(following)
    following_relationships.exists?(following:)
  end

  def follow!(user)
    following_relationships.create!(following_id: user.id)
  end

  private

    def create_profile!
      build_profile.save!
    end
end
