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
    subject(:record) { build(:tag) }

    context "タグ名が空の場合" do
      before { record.name = "" }

      it "バリデーションが失敗し、エラーメッセージが返る" do
        expect(subject).not_to be_valid
        expect(record.errors.full_messages).to eq ["タグ名を入力してください", "タグ名に記号やスペースは使用できません"]
      end
    end

    context "タグ名が重複している場合" do
      before do
        create(:tag, name: "Tag")
        record.name = "Tag"
      end

      include_examples "バリデーション失敗", "タグ名はすでに存在します"
    end

    context "タグ名が20文字を超えている場合" do
      before { record.name = Faker::Lorem.characters(number: 21) }

      include_examples "バリデーション失敗", "タグ名は20文字以内で入力してください"
    end

    context "タグ名に記号を含む場合" do
      before { record.name = "invalid tag" }

      include_examples "バリデーション失敗", "タグ名に記号やスペースは使用できません"
    end

    context "タグ名にスペースを含む場合" do
      before { record.name = "invalid@tag" }

      include_examples "バリデーション失敗", "タグ名に記号やスペースは使用できません"
    end

    include_examples "バリデーション成功"
  end
end
