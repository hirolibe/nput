RSpec.describe Profile, type: :model do
  describe "バリデーション" do
    subject(:record) { user.profile }

    let(:user) { create(:user) }

    include_examples "バリデーション成功"
  end
end
