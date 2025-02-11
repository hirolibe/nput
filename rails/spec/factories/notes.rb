FactoryBot.define do
  factory :note do
    user
    title { Faker::Lorem.sentence }
    description { Faker::Lorem.paragraph[0..199] }
    content { Faker::Lorem.paragraph }
    status { :published }
    published_at { Time.current }

    transient do
      with_durations { true }
      with_tags { true }
    end

    after(:build) do |note, evaluator|
      2.times do |i|
        file_path = Rails.root.join("spec", "fixtures", "files", "valid_image#{i}.jpg")
        note.images.attach(
          io: File.open(file_path),
          filename: "valid_image#{i}.jpg",
          content_type: "image/jpeg",
        )
      end

      if evaluator.with_durations
        note.durations = build_list(:duration, 3, note:)
      end
    end

    after(:create) do |note, evaluator|
      if evaluator.with_tags
        create_list(:note_tag, 5, note:)
      end
    end
  end
end
