class User < ApplicationRecord
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :uid, presence: true, uniqueness: true

  has_many :notes, dependent: :destroy
  has_many :comments, dependent: :destroy

  has_one :profile, dependent: :destroy

  def display_name
    profile&.nickname || name
  end

  def bio
    profile&.bio
  end

  def avatar_url
    if profile&.avatar&.attached?
      Rails.application.routes.url_helpers.url_for(profile.avatar)
    else
      profile&.firebase_avatar_url
    end
  end

  def sns_link_x
    profile&.sns_link_x
  end

  def sns_link_github
    profile&.sns_link_github
  end

  def cheer_points
    profile&.cheer_points
  end
end
