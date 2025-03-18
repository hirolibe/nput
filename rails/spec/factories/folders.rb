FactoryBot.define do
  factory :folder do
    user
    folder_name { Faker::Lorem.sentence }
  end
end
