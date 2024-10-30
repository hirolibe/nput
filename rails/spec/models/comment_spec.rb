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
    include_examples "入力必須項目のバリデーションエラー", "comment", "content", "コメント"
    include_examples "バリデーション成功"
  end
end
