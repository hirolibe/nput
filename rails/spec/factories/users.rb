FactoryBot.define do
  factory :user do
    email { Faker::Internet.email }
    uid { Faker::Internet.uuid }
    cheer_points { Faker::Number.between(from: 0, to: 10) }
  end
end
