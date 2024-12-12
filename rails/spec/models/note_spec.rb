require "rails_helper"

RSpec.describe Note, type: :model do
  describe "新規作成" do
    context "全ての値が有効な場合" do
      subject { create(:note) }

      it "ノートとデュレーションを新規作成できる" do
        expect { subject }.to change { Note.count }.by(1) and
          change { Duration.count }.by(3)
      end
    end
  end

  describe "バリデーション" do
    include_examples "入力必須項目のバリデーションエラー", "note", "status", "ステータス"

    context "概要が200文字を超える場合" do
      before { record.description = Faker::Lorem.paragraph(sentence_count: 30) }

      it "バリデーションが失敗し、エラーメッセージが返る" do
        expect(subject).not_to be_valid
        expect(record.errors.full_messages).to eq ["概要は200文字以内で入力してください"]
      end
    end

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

    context "ステータスが下書きまたは公開中であり、デュレーションレコードが存在しない場合" do
      subject(:record) { build(:note, with_durations: false) }

      include_examples "バリデーション失敗", "下書きまたは公開中のノートにはデュレーションレコードが必要です"
    end

    context "タグを6個以上設定した場合" do
      subject(:record) { build(:note) }

      before do
        record.tags = create_list(:tag, 6)
      end

      include_examples "バリデーション失敗", "タグは5個まで設定できます"
    end

    include_examples "バリデーション成功"
  end
end
