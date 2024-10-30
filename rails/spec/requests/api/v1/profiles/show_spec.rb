require "rails_helper"

RSpec.describe "Api::V1::Profiles GET /api/v1/profile", type: :request do
  subject { get(api_v1_profile_path, headers:) }

  let(:headers) { { Authorization: "Bearer token" } }
  let(:user) { create(:user) }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    it "200ステータスとプロフィールの情報が返る" do
      subject
      expect(response).to have_http_status(:ok)
      expect(json_response.keys).to eq EXPECTED_PROFILE_KEYS
    end
  end
end
