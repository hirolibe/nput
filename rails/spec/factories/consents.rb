FactoryBot.define do
  factory :consent do
    user
    terms_version { "1.0" }
    privacy_version { "1.0" }
    consent_date { Time.current }
  end
end
