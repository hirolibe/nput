require "rails_helper"

RSpec.describe Comment, type: :model do
  describe "新規作成" do
    context "全ての値が有効な場合" do
      subject { create(:comment) }

      it "正常にレコードを新規作成できる" do
        expect { subject }.to change { Comment.count }.by(1)
      end
    end
  end

  describe "バリデーション" do
    subject { comment.valid? }

    let(:comment) { build(:comment) }

    context "全ての値が有効な場合" do
      it "バリデーションが成功する" do
        expect(subject).to be_truthy
      end
    end

    context "コメントが空の場合" do
      before { comment.content = "" }

      it "バリデーションが失敗し、エラーメッセージが返る" do
        expect(subject).to be_falsy
        expect(comment.errors.full_messages).to eq ["コメントを入力してください"]
      end
    end
  end
end
