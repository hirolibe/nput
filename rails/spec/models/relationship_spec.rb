require "rails_helper"

RSpec.describe Relationship, type: :model do
  describe "新規作成（フォロー）" do
    context "全ての値が有効な場合" do
      subject { create(:relationship) }

      it "アカウントをフォローできる" do
        expect { subject }.to change { Relationship.count }.by(1)
      end
    end
  end

  describe "バリデーション" do
    subject(:record) { build(:relationship, follower_id:, following_id:) }

    let(:follower) { create(:user) }
    let(:follower_id) { follower.id }
    let(:following) { create(:user) }
    let(:following_id) { following.id }

    context "すでにアカウントをフォローしている場合" do
      before { create(:relationship, follower_id:, following_id:) }

      include_examples "バリデーション失敗", "すでにこのアカウントをフォローしています"
    end

    include_examples "バリデーション成功"
  end
end
