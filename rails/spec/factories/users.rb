FactoryBot.define do
  factory :user do
    uid { Faker::Internet.uuid }
    email { Faker::Internet.email }
    cheer_points { Faker::Number.between(from: 0, to: 3600) }
    role { "user" }
    guest { false }

    name do
      loop do
        generated_name = SecureRandom.alphanumeric(20)
        break generated_name unless User.where(name: generated_name).exists?
      end
    end
  end
end
