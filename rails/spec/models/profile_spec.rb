RSpec.describe Profile, type: :model do
  describe "バリデーション" do
    subject(:record) { user.profile }

    let(:user) { create(:user) }

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

    include_examples "バリデーション成功"
  end
end
