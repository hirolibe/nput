require "rails_helper"

RSpec.describe Note, type: :model do
  describe "新規作成" do
    context "全ての値が有効な場合" do
      subject { create(:note) }

      it "ノートを新規作成できる" do
        expect { subject }.to change { Note.count }.by(1)
      end
    end
  end

  describe "バリデーション" do
    include_examples "入力必須項目のバリデーションエラー", "note", "status", "ステータス"

    context "ステータスが公開中の場合" do
      include_examples "ノートのバリデーションエラー"
    end

    context "ステータスが未保存かつ、すでに未保存ステータスのノートを所有している場合" do
      subject(:record) { build(:note) }

      before do
        create(:note, user: record.user, status: "unsaved")
        record.status = "unsaved"
      end

      include_examples "バリデーション失敗", "未保存のノートは複数保有できません"
    end

    include_examples "バリデーション成功"
  end
end
