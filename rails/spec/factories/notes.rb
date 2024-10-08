FactoryBot.define do
  factory :note do
    user
    title { Faker::Lorem.sentence }
    content { Faker::Lorem.paragraph }
    published_at { Time.current }
    status { :published }
  end
end
