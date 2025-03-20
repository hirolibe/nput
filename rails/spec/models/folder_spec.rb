require "rails_helper"

RSpec.describe Folder, type: :model do
  describe "新規作成" do
    context "全ての値が有効な場合" do
      subject { create(:folder) }

      it "フォルダを新規作成できる" do
        expect { subject }.to change { Folder.count }.by(1)
      end
    end
  end

  describe "バリデーション" do
    subject(:record) { build(:folder) }

    include_examples "入力必須項目のバリデーションエラー", "folder", "name", "フォルダ名"

    context "フォルダ名が40文字を超える場合" do
      before { record.name = Faker::Lorem.paragraph(sentence_count: 10) }

      it "バリデーションが失敗し、エラーメッセージが返る" do
        expect(subject).not_to be_valid
        expect(record.errors.full_messages).to eq ["フォルダ名は40文字以内で入力してください"]
      end
    end

    include_examples "バリデーション成功"
  end
end
