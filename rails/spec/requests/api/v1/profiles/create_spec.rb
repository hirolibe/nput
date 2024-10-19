require "rails_helper"

RSpec.describe "Api::V1::Profiles POST /api/v1/profile", type: :request do
  subject { post(api_v1_profile_path, headers:) }

  let(:headers) { { Authorization: "Bearer token" } }
  let(:current_user) { create(:user) }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => current_user.uid }) }

    context "プロフィールが存在する場合" do
      it "プロフィールが新規作成される" do
        expect { subject }.to change { current_user.reload.profile }.from(nil).to(instance_of(Profile))
        expect(response).to have_http_status(:ok)
        expect(json_response.keys).to eq ["id", "nickname", "bio", "firebase_avatar_url", "sns_link_x", "sns_link_github", "cheer_points"]
      end
    end

    context "プロフィールが存在しない場合" do
      before { create(:profile, user: current_user) }

      it "既存のプロフィールが返る" do
        expect { subject }.not_to change { current_user.reload.profile }
        expect(response).to have_http_status(:ok)
        expect(json_response.keys).to eq ["id", "nickname", "bio", "firebase_avatar_url", "sns_link_x", "sns_link_github", "cheer_points"]
      end
    end
  end
end
