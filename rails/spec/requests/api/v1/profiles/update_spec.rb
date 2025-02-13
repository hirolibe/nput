require "rails_helper"

RSpec.describe "Api::V1::Profiles PATCH /api/v1/profile", type: :request do
  subject { patch(api_v1_profile_path, headers:, params:) }

  let(:headers) { { Authorization: "Bearer token" } }
  let(:params) {
    {
      profile: {
        user:,
        nickname: "更新後のニックネーム",
        bio: "更新後の自己紹介",
        x_username: "更新後のXのユーザー名",
        github_username: "更新後のGitHubのユーザー名",
      },
    }
  }
  let(:user) { create(:user) }
  let(:profile) { user.profile }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before do
      stub_token_verification.and_return({ "sub" => user.uid })
    end

    it "プロフィールが更新され、200ステータスとプロフィールの情報が返る" do
      subject
      expect(profile.reload).to have_attributes(
        nickname: "更新後のニックネーム",
        bio: "更新後の自己紹介",
        x_username: "更新後のXのユーザー名",
        github_username: "更新後のGitHubのユーザー名",
      )

      expect(response).to have_http_status(:ok)
      expect(json_response.keys).to eq ["profile", "message"]
      expect(json_response["profile"].keys).to eq EXPECTED_PROFILE_KEYS + ["user"]
      expect(json_response["profile"]["user"].keys).to eq ["name", "cheer_points", "cheers_count"]
      expect(json_response["message"]).to eq("プロフィールを更新しました！")
    end
  end
end
