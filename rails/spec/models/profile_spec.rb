RSpec.describe Profile, type: :model do
  describe "バリデーション" do
    subject(:record) { user.profile }

    let(:user) { create(:user) }

    before do
      record.update!(
        nickname: Faker::Internet.username(specifier: 5..30),
        bio: Faker::Lorem.sentence(word_count: 20)[0...120],
        x_username: Faker::Internet.username,
        github_username: Faker::Internet.username,
      )
      file_path = Rails.root.join("spec", "fixtures", "files", "valid_image.jpg")
      record.avatar.attach(io: File.open(file_path), filename: "valid_image.jpg", content_type: "image/jpeg")
    end

    context "ニックネームが30文字を超える場合" do
      before { record.nickname = Faker::Lorem.characters(number: 31) }

      it "バリデーションが失敗し、エラーメッセージが返る" do
        expect(subject).not_to be_valid
        expect(record.errors.full_messages).to eq ["ニックネームは30文字以内で入力してください"]
      end
    end

    context "自己紹介文が120文字を超える場合" do
      before { record.bio = Faker::Lorem.characters(number: 121) }

      it "バリデーションが失敗し、エラーメッセージが返る" do
        expect(subject).not_to be_valid
        expect(record.errors.full_messages).to eq ["自己紹介文は120文字以内で入力してください"]
      end
    end

    context "アバター画像が不適切なファイル形式の場合" do
      before do
        file_path = Rails.root.join("spec", "fixtures", "files", "invalid_file.txt")
        record.avatar.attach(io: File.open(file_path), filename: "invalid_file.txt", content_type: "text/plain")
      end

      it "バリデーションが失敗し、エラーメッセージが返る" do
        expect(subject).not_to be_valid
        expect(record.errors.full_messages).to eq ["アバター画像はPNG、JPEG、またはWebP形式のみ対応しています"]
      end
    end

    include_examples "バリデーション成功"
  end
end
