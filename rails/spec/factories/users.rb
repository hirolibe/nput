FactoryBot.define do
  factory :user do
    uid { Faker::Internet.uuid }
    email { Faker::Internet.email }
    cheer_points { Faker::Number.between(from: 0, to: 50) }

    name do
      generated_name = nil
      5.times do
        temp_name = Faker::Internet.username[0..19]
        next unless !User.exists?(name: temp_name) &&
                    temp_name.match?(/\A[a-zA-Z0-9_][a-zA-Z0-9_-]*[a-zA-Z0-9_]\z/) &&
                    !temp_name.start_with?("-") &&
                    !temp_name.end_with?("-")

        generated_name = temp_name
        break
      end
      generated_name || "user_#{SecureRandom.hex(4)}"
    end
  end
end
