require "rails_helper"

RSpec.describe Comment, type: :model do
  describe "新規作成" do
    context "全ての値が有効な場合" do
      subject { create(:comment) }

      it "コメントを新規作成できる" do
        expect { subject }.to change { Comment.count }.by(1)
      end
    end
  end

  describe "バリデーション" do
    subject(:record) { build(:comment) }

    context "画像が不適切なファイル形式の場合" do
      before do
        file_path = Rails.root.join("spec", "fixtures", "files", "invalid_file.txt")
        record.images.attach(io: File.open(file_path), filename: "invalid_file.txt", content_type: "text/plain")
      end

      it "バリデーションが失敗し、エラーメッセージが返る" do
        expect(subject).not_to be_valid
        expect(record.errors.full_messages).to eq ["画像はPNG、JPEG、WebPまたはGIF形式のみ対応しています"]
      end
    end

    include_examples "入力必須項目のバリデーションエラー", "comment", "content", "コメント"
    include_examples "バリデーション成功"
  end
end
