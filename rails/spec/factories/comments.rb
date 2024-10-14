FactoryBot.define do
  factory :comment do
    user
    note
    content { Faker::Lorem.sentence }
  end
end
