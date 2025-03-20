FactoryBot.define do
  factory :folder do
    user
    name { Faker::Lorem.sentence }
  end
end
