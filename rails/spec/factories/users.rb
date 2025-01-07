FactoryBot.define do
  factory :user do
    uid { Faker::Internet.uuid }
    email { Faker::Internet.email }
    cheer_points { Faker::Number.between(from: 0, to: 3600) }
    terms_version { "1" }
    privacy_version { "1" }
    agreed_at { Time.current }

    name do
      generated_name = nil
      5.times do
        temp_name = Faker::Internet.username[0..19]
        filtered_name = temp_name.gsub(/[^a-zA-Z0-9_-]/, "")
        next unless !User.exists?(name: filtered_name) &&
                    filtered_name.match?(/\A[a-zA-Z0-9_][a-zA-Z0-9_-]*[a-zA-Z0-9_]\z/) &&
                    !filtered_name.start_with?("-") &&
                    !filtered_name.end_with?("-")

        generated_name = filtered_name
        break
      end

      generated_name || "user_#{SecureRandom.hex(4)}"
    end
  end
end
