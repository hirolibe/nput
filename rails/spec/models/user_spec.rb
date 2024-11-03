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

    context "保有エールポイントが空の場合" do
      before { record.cheer_points = nil }

      include_examples "バリデーション失敗", "保有エールポイントは数値で入力してください"
    end

    context "保有エールポイントの下限が0を下回っている場合" do
      before { record.cheer_points = -1 }

      include_examples "バリデーション失敗", "保有エールポイントは0以上の値にしてください"
    end

    context "保有エールポイントの上限が10を上回っている場合" do
      before { record.cheer_points = 11 }

      include_examples "バリデーション失敗", "保有エールポイントは10以下の値にしてください"
    end

    include_examples "バリデーション成功"
  end
end
