require "rails_helper"

RSpec.describe User, type: :model do
  describe "新規作成" do
    context "全ての値が有効な場合" do
      subject { create(:user) }

      it "正常にレコードを新規作成できる" do
        expect { subject }.to change { User.count }.by(1)
      end
    end
  end

  describe "バリデーション" do
    subject { user.valid? }

    let(:user) { build(:user) }

    context "全ての値が有効な場合" do
      it "バリデーションが成功する" do
        expect(subject).to be_truthy
      end
    end

    context "emailが空の場合" do
      before { user.email = nil }

      it "バリデーションが失敗し、エラーメッセージが返る" do
        expect(subject).to be_falsy
        expect(user.errors.full_messages).to eq ["Emailを入力してください"]
      end
    end

    context "emailが重複している場合" do
      before do
        create(:user, email: "test@example.com")
        user.email = "test@example.com"
      end

      it "バリデーションが失敗し、エラーメッセージが返る" do
        expect(subject).to be_falsy
        expect(user.errors.full_messages).to eq ["Emailはすでに存在します"]
      end
    end

    context "uidが空の場合" do
      before { user.uid = nil }

      it "バリデーションが失敗し、エラーメッセージが返る" do
        expect(subject).to be_falsy
        expect(user.errors.full_messages).to eq ["Uidを入力してください"]
      end
    end

    context "nameが空の場合" do
      before { user.name = nil }

      it "バリデーションが失敗し、エラーメッセージが返る" do
        expect(subject).to be_falsy
        expect(user.errors.full_messages).to eq ["ユーザー名を入力してください"]
      end
    end
  end
end
