FactoryBot.define do
  factory :blob, class: "ActiveStorage::Blob" do
    filename { "test_image.png" }
    content_type { "image/png" }
    byte_size { 1.kilobyte }
    checksum { Digest::MD5.base64digest("test content") }
    service_name { ActiveStorage::Blob.service.name }

    after(:build) do |blob|
      Tempfile.create(["test_image", ".png"]) do |file|
        file.write("test content")
        file.rewind
        blob.upload(file)
      end
    end
  end
end
