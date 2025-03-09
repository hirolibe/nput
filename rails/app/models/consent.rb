class Consent < ApplicationRecord
  belongs_to :user

  validates :terms_version, presence: true
  validates :privacy_version, presence: true
  validates :consent_date, presence: true
end
