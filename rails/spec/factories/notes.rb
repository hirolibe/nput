FactoryBot.define do
  factory :note do
    user
    title { Faker::Lorem.sentence }
    content { Faker::Lorem.paragraph }
    status { :published }
    published_at { Time.current }

    transient do
      with_tags { true }
    end

    after(:create) do |note, evaluator|
      if evaluator.with_tags
        create_list(:note_tag, 5, note:)
      end
    end
  end
end
