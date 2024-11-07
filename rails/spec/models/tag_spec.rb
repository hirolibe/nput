require "rails_helper"

RSpec.describe Tag, type: :model do
  describe "新規作成" do
    context "全ての値が有効な場合" do
      subject { create(:tag) }

      it "タグを新規作成できる" do
        expect { subject }.to change { Tag.count }.by(1)
      end
    end
  end

  describe "バリデーション" do
    include_examples "入力必須項目のバリデーションエラー", "tag", "name", "タグ名"

    context "タグ名が重複している場合" do
      subject(:record) { build(:tag) }

      before do
        create(:tag, name: "テストタグ")
        record.name = "テストタグ"
      end

      include_examples "バリデーション失敗", "タグ名はすでに存在します"
    end

    include_examples "バリデーション成功"
  end
end
