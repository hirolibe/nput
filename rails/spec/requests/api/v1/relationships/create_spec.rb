require "rails_helper"

RSpec.describe "Api::V1::Relationships POST /api/v1/:name/relationship", type: :request do
  subject { post(api_v1_user_relationship_path(name), headers:) }

  let(:follower) { create(:user) }
  let(:following) { create(:user) }
  let(:name) { following.name }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => follower.uid }) }

    include_examples "リソース不在エラー", "アカウント", "name"

    context "すでにアカウントをフォローしている場合" do
      before { follower.following_relationships.create!(following:) }

      include_examples "バリデーションエラーのレスポンス検証"
    end

    context "アカウントをフォローしていない場合" do
      it "アカウントをフォローし、201ステータスが返る" do
        expect { subject }.to change { follower.following_relationships.count }.by(1)
        expect(response).to have_http_status(:created)
      end
    end
  end
end
