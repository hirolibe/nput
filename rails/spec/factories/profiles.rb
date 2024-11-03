FactoryBot.define do
  factory :profile do
    nickname { Faker::Internet.username }
    bio { Faker::Lorem.sentence }
    x_username { Faker::Internet.username }
    github_username { Faker::Internet.username }
  end
end
