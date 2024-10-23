require "rails_helper"

RSpec.describe Cheer, type: :model do
  describe "新規作成（ノートへのチアーポイントの付与）" do
    context "全ての値が有効な場合" do
      subject { create(:cheer) }

      it "正常にノートにチアーポイントを付与できる" do
        expect { subject }.to change { Note.count }.by(1)
      end
    end
  end

  describe "バリデーション" do
    subject { cheer.valid? }

    let(:cheer) { build(:cheer, user_id:, note_id:) }
    let(:user) { create(:user) }
    let(:user_id) { user.id }
    let(:note) { create(:note) }
    let(:note_id) { note.id }

    context "ノートにチアーポイントを付与していない場合" do
      it "バリデーションが成功する" do
        expect(subject).to be_truthy
      end
    end

    context "すでにノートにチアーポイントを付与している場合" do
      before { create(:cheer, user_id:, note_id:) }

      it "バリデーションが失敗し、エラーメッセージが返る" do
        expect(subject).to be_falsy
        expect(cheer.errors.full_messages).to eq ["ユーザーはすでにこのノートにチアーポイントを付与しています"]
      end
    end
  end
end
