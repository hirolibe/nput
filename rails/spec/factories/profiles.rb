FactoryBot.define do
  factory :profile do
    user
    nickname { Faker::Internet.username }
    bio { Faker::Lorem.sentence }
    firebase_avatar_url { Faker::Avatar.image }
    sns_link_x { "http://x.com/user_profile" }
    sns_link_github { "http://github.com/user_profile" }
    cheer_points { Faker::Number.between(from: 0, to: 10) }
  end
end
