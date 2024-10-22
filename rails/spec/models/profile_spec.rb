RSpec.describe Profile, type: :model do
  describe "バリデーション" do
    subject { profile.valid? }

    let(:profile) { build(:profile) }

    context "全てのパラメータを正しく入力した場合" do
      it "バリデーションが成功する" do
        expect(subject).to be_truthy
      end
    end

    context "保有エールポイントの下限が0を下回っている場合" do
      before { profile.cheer_points = -1 }

      it "バリデーションが失敗し、エラーメッセージが返る" do
        expect(subject).to be_falsy
        expect(profile.errors.full_messages).to eq ["保有エールポイントは0以上の値にしてください"]
      end
    end

    context "保有エールポイントの上限が10を上回っている場合" do
      before { profile.cheer_points = 11 }

      it "バリデーションが失敗し、エラーメッセージが返る" do
        expect(subject).to be_falsy
        expect(profile.errors.full_messages).to eq ["保有エールポイントは10以下の値にしてください"]
      end
    end
  end
end
