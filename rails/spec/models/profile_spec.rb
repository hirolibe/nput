RSpec.describe Profile, type: :model do
  describe "バリデーション" do
    subject(:record) { user.profile }

    let(:user) { create(:user) }

    context "ニックネームが40文字を超える場合" do
      before { record.nickname = Faker::Lorem.characters(number: 41) }

      it "バリデーションが失敗し、エラーメッセージが返る" do
        expect(subject).not_to be_valid
        expect(record.errors.full_messages).to eq ["ニックネームは40文字以内で入力してください"]
      end
    end

    include_examples "バリデーション成功"
  end
end
