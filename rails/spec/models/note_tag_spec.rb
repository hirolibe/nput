require "rails_helper"

RSpec.describe NoteTag, type: :model do
  describe "新規作成（ノートへのタグ付け）" do
    context "全ての値が有効な場合" do
      subject { create(:note_tag, note:) }

      let(:note) { create(:note, with_tags: false) }

      it "ノートにタグ付けできる" do
        expect { subject }.to change { NoteTag.count }.by(1)
      end
    end
  end

  describe "バリデーション" do
    subject(:record) { build(:note_tag, note:, tag:) }

    let(:note) { create(:note) }
    let(:tag) { create(:tag) }

    context "同じタグ名を複数設定しようとした場合" do
      before { create(:note_tag, note:, tag:) }

      include_examples "バリデーション失敗", "同じタグ名は複数設定できません"
    end

    include_examples "バリデーション成功"
  end
end
