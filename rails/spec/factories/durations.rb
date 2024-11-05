FactoryBot.define do
  factory :duration do
    user
    note
    duration { rand(300..7200) }
  end
end
