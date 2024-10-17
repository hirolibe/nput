FactoryBot.define do
  factory :profile do
    user
    nickname { Faker::Name.name }
    bio { Faker::Lorem.sentence }
    firebase_avatar_url { "https://example.com/avatar.png" }
    sns_link_x { "https://x.com/user_profile" }
    sns_link_github { "https://github.com/user_profile" }
    cheer_points { Faker::Number.between(from: 0, to: 10) }
  end
end
