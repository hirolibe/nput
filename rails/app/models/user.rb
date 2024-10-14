class User < ApplicationRecord
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :uid, presence: true, uniqueness: true

  has_many :notes, dependent: :destroy
  has_many :comments, dependent: :destroy
end
