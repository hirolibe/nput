FactoryBot.define do
  factory :profile do
    user
    nickname { Faker::Internet.username }
    bio { Faker::Lorem.sentence }
    firebase_avatar_url { Faker::Avatar.image }
    sns_link_x { Faker::Internet.url(host: "x.com", path: "/user_profile") }
    sns_link_github { Faker::Internet.url(host: "github.com", path: "/user_profile") }
    cheer_points { Faker::Number.between(from: 0, to: 10) }
  end
end
