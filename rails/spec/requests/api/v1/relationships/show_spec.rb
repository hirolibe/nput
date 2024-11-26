require "rails_helper"

RSpec.describe "Api::V1::Relationships GET /api/v1/users/:user_id/relationship", type: :request do
  subject { get(api_v1_user_relationship_path(user_id), headers:) }

  let(:follower) { create(:user) }
  let(:following) { create(:user) }
  let(:user_id) { following.id }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => follower.uid }) }

    include_examples "リソース不在エラー", "アカウント", "user_id"

    context "アカウントが存在する場合" do
      before { create(:relationship, follower:, following:) }

      it "200ステータス、フォロー状態が返る" do
        subject
        expect(json_response["has_followed"]).to be true
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
