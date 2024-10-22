class User < ApplicationRecord
  validates :email, presence: true, uniqueness: true
  validates :uid, presence: true, uniqueness: true

  has_many :notes, dependent: :destroy
  has_many :comments, dependent: :destroy

  has_one :profile, dependent: :destroy

  after_create :create_profile!

  private

    def create_profile!
      build_profile.save!
    end
end
