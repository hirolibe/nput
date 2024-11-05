require "rails_helper"

RSpec.describe Duration, type: :model do
  describe "新規作成" do
    context "全ての値が有効な場合" do
      subject { create(:duration) }

      it "デュレーションを新規作成できる" do
        expect { subject }.to change { Duration.count }.by(1)
      end
    end
  end
end
