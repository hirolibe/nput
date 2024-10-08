require "rails_helper"

RSpec.describe Note, type: :model do
  describe "新規作成" do
    context "全ての値が有効な場合" do
      subject { create(:note) }

      it "正常にレコードを新規作成できる" do
        expect { subject }.to change { Note.count }.by(1)
      end
    end
  end

  describe "バリデーション" do
    subject { note.valid? }

    let(:note) { build(:note) }

    context "全ての値が有効な場合" do
      it "バリデーションが成功する" do
        expect(subject).to be_truthy
      end
    end

    context "ステータスが公開済かつ、タイトルが空の場合" do
      before { note.title = "" }

      it "バリデーションが失敗し、エラーメッセージが返る" do
        expect(subject).to be_falsy
        expect(note.errors.full_messages).to eq ["タイトルを入力してください"]
      end
    end

    context "ステータスが公開済かつ、本文が空の場合" do
      before { note.content = "" }

      it "バリデーションが失敗し、エラーメッセージが返る" do
        expect(subject).to be_falsy
        expect(note.errors.full_messages).to eq ["本文を入力してください"]
      end
    end

    context "ステータスが公開済かつ、公開日時が空の場合" do
      before { note.published_at = "" }

      it "バリデーションが失敗し、エラーメッセージが返る" do
        expect(subject).to be_falsy
        expect(note.errors.full_messages).to eq ["公開日時を入力してください"]
      end
    end

    context "ステータスが未保存かつ、すでに同一ユーザーが未保存ステータスの記事を所有している場合" do
      before do
        create(:note, user: note.user, status: "unsaved")
        note.status = "unsaved"
      end

      it "バリデーションが失敗し、エラーメッセージが返る" do
        expect(subject).to be_falsy
        expect(note.errors.full_messages).to eq ["未保存の記事は複数保有できません"]
      end
    end
  end
end
