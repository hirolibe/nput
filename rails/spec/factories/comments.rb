FactoryBot.define do
  factory :comment do
    user
    note
    content { Faker::Lorem.sentence }

    after(:build) do |comment|
      2.times do |i|
        file_path = Rails.root.join("spec", "fixtures", "files", "valid_image#{i}.jpg")
        comment.images.attach(
          io: File.open(file_path),
          filename: "valid_image#{i}.jpg",
          content_type: "image/jpeg",
        )
      end
    end
  end
end
