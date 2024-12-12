require "rails_helper"

RSpec.describe User, type: :model do
  describe "新規作成" do
    context "全ての値が有効な場合" do
      subject { create(:user) }

      it "ユーザーとプロフィールを新規作成できる" do
        expect { subject }.to change { User.count }.by(1) and
          change { Profile.count }.by(1)
      end
    end
  end

  describe "バリデーション" do
    subject(:record) { build(:user) }

    include_examples "入力必須項目のバリデーションエラー", "user", "email", "メールアドレス"

    context "入力必須項目、入力パターン、最大文字数に関するバリデーションエラー" do
      context "ユーザー名が空の場合" do
        before { record.name = "" }

        it "バリデーションが失敗し、エラーメッセージが返る" do
          expect(subject).not_to be_valid
          expect(record.errors.full_messages).to eq ["ユーザー名を入力してください", "ユーザー名は半角英数字と記号（ _ と - ）のみ使用可能で、- は先頭と末尾に使用できません"]
        end
      end

      context "ユーザー名が20文字を超える場合" do
        before { record.name = Faker::Lorem.characters(number: 21) }

        it "バリデーションが失敗し、エラーメッセージが返る" do
          expect(subject).not_to be_valid
          expect(record.errors.full_messages).to eq ["ユーザー名は20文字以内で入力してください"]
        end
      end
    end

    context "メールアドレスが重複している場合" do
      before do
        create(:user, email: "test@example.com")
        record.email = "test@example.com"
      end

      include_examples "バリデーション失敗", "メールアドレスtest@example.comはすでに存在します"
    end

    context "ユーザー名が重複している場合" do
      before do
        create(:user, name: "John")
        record.name = "John"
      end

      include_examples "バリデーション失敗", "ユーザー名Johnはすでに存在します"
    end

    context "保有エールポイントが空の場合" do
      before { record.cheer_points = nil }

      include_examples "バリデーション失敗", "保有エールポイントは数値で入力してください"
    end

    context "保有エールポイントの下限が0を下回っている場合" do
      before { record.cheer_points = -1 }

      include_examples "バリデーション失敗", "保有エールポイントは0以上の値にしてください"
    end

    context "保有エールポイントの上限が50を上回っている場合" do
      before { record.cheer_points = 51 }

      include_examples "バリデーション失敗", "保有エールポイントは50以下の値にしてください"
    end

    include_examples "バリデーション成功"
  end
end
