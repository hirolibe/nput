require "rails_helper"

RSpec.describe "Api::V1::Relationships GET /api/v1/:name/relationship", type: :request do
  subject { get(api_v1_user_relationship_path(name), headers:) }

  let(:follower) { create(:user) }
  let(:following) { create(:user) }
  let(:name) { following.name }
  let(:headers) { { Authorization: "Bearer token" } }

  before { stub_token_verification.and_return({ "sub" => follower.uid }) }

  include_examples "リソース不在エラー", "アカウント", "name"

  context "アカウントが存在する場合" do
    before { create(:relationship, follower:, following:) }

    it "200ステータス、フォロー状態が返る" do
      subject
      expect(json_response["has_followed"]).to be true
      expect(response).to have_http_status(:ok)
    end
  end
end
