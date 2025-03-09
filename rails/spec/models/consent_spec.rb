require "rails_helper"

RSpec.describe Consent, type: :model do
  describe "新規作成" do
    context "全ての値が有効な場合" do
      subject { create(:consent) }

      it "同意情報を新規作成できる" do
        expect { subject }.to change { Consent.count }.by(1)
      end
    end
  end

  describe "バリデーション" do
    subject(:record) { build(:consent) }

    include_examples "同意情報のバリデーションエラー"
    include_examples "バリデーション成功"
  end
end
