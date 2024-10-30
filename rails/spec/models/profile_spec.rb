RSpec.describe Profile, type: :model do
  describe "バリデーション" do
    subject(:record) { user.profile }

    let(:user) { create(:user) }

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
