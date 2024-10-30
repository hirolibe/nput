require "rails_helper"

RSpec.describe User, type: :model do
  describe "新規作成" do
    context "全ての値が有効な場合" do
      subject { create(:user) }

      it "ユーザーとプロフィールを新規作成できる" do
        expect { subject }.to change { User.count }.by(1) and
          change { Profile.count }.by(1)
      end
    end
  end

  describe "バリデーション" do
    include_examples "ユーザーのバリデーションエラー"

    context "emailが重複している場合" do
      subject(:record) { build(:user) }

      before do
        create(:user, email: "test@example.com")
        record.email = "test@example.com"
      end

      include_examples "バリデーション失敗", "Emailはすでに存在します"
    end

    include_examples "バリデーション成功"
  end
end
