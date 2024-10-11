FactoryBot.define do
  factory :note do
    user
    title { Faker::Lorem.sentence }
    content { Faker::Lorem.paragraph }
    status { :published }
    published_at { Time.current }
  end
end
