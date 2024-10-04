require "rails_helper"

RSpec.describe User, type: :model do
  context "fFactoryBotで生成したUserの場合" do
    let(:user) { create(:user) }

    it "有効なUserレコードが作成される" do
      expect(user).to be_valid
    end

    it "emailがない場合、無効である" do
      user.email = nil
      expect(user).not_to be_valid
		end

		it "emailが重複している場合、無効である" do
      create(:user, email: "test@example.com")
      user.email = "test@example.com"
      expect(user).not_to be_valid
		end
  end
end
