require "rails_helper"

RSpec.describe "Api::V1::Follows GET /api/v1/users/:user_id/follow", type: :request do
  subject { get(api_v1_user_follow_path(user_id), headers:) }

  let(:headers) { { Authorization: "Bearer token" } }
  let(:follower) { create(:user) }
  let(:following) { create(:user) }
  let(:user_id) { following.id }

  before { create(:relationship, follower:, following:) }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => follower.uid }) }

    include_examples "リソース不在エラー", "アカウント", "user_id"

    context "アカウントが存在する場合" do
      it "200ステータスとフォロー状態の情報が返る" do
        subject
        expect(response).to have_http_status(:ok)
        expect(json_response.keys).to eq ["follow_status"]
        expect(json_response["follow_status"]).to be true
      end
    end
  end
end
