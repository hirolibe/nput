require "rails_helper"

RSpec.describe Cheer, type: :model do
  describe "新規作成（ノートへのエール）" do
    context "全ての値が有効な場合" do
      subject { create(:cheer) }

      it "ノートにエールできる" do
        expect { subject }.to change { Cheer.count }.by(1)
      end
    end
  end

  describe "バリデーション" do
    subject(:record) { build(:cheer, user_id:, note_id:) }

    let(:user) { create(:user) }
    let(:user_id) { user.id }
    let(:note) { create(:note) }
    let(:note_id) { note.id }

    context "すでにノートにエールしている場合" do
      before { create(:cheer, user_id:, note_id:) }

      include_examples "バリデーション失敗", "すでにこのノートにエールしています"
    end

    include_examples "バリデーション成功"
  end
end
