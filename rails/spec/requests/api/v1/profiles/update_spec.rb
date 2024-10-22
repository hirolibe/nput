require "rails_helper"

RSpec.describe "Api::V1::Profiles PATCH /api/v1/profile", type: :request do
  subject { patch(api_v1_profile_path, headers:) }

  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    subject { patch(api_v1_profile_path, headers:, params:) }

    let(:user) { create(:user) }
    let(:profile) { user.profile }
    let(:params) {
      {
        profile: {
          user:,
          nickname: "更新後のニックネーム",
          bio: "更新後の自己紹介",
          x_username: "更新後のXのユーザー名",
          github_username: "更新後のGitHubのユーザー名",
          cheer_points: 10,
        },
      }
    }

    before do
      stub_token_verification.and_return({ "sub" => user.uid })
    end

    context "全てのパラメータを正しく入力した場合" do
      it "正常にプロフィールを更新できる" do
        expect { subject }.to change { profile.reload.nickname }.from(profile.nickname).to("更新後のニックネーム") and
          change { profile.reload.bio }.from(profile.bio).to("更新後の自己紹介") and
          change { profile.reload.x_username }.from(profile.x_username).to("更新後のXのユーザー名") and
          change { profile.reload.github_username }.from(profile.github_username).to("更新後のGitHubのユーザー名") and
          change { profile.reload.cheer_points }.from(profile.cheer_points).to(10)
        expect(response).to have_http_status(:ok)
        expect(json_response.keys).to eq ["profile", "message"]
        expect(json_response["profile"].keys).to eq ["id", "nickname", "bio", "x_username", "github_username", "cheer_points", "avatar_url"]
        expect(json_response["message"]).to eq("プロフィールを更新しました！")
      end
    end
  end
end
