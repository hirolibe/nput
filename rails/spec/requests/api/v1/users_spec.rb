require "rails_helper"

RSpec.describe "Api::V1::Users", type: :request do
  describe "GET /api/v1/users/:id" do
    subject { get(api_v1_user_path(user_id)) }

    context "アカウントが存在する場合" do
      let(:user) { create(:user) }
      let(:user_id) { user.id }

      it "200ステータス、プロフィールの情報、ノートの情報が返る" do
        subject
        expect(response).to have_http_status(:ok)
        expect(json_response.keys).to eq ["id", "profile"]
        expect(json_response["profile"].keys).to eq ["id", "nickname", "bio", "x_username", "github_username", "cheer_points", "avatar_url"]
      end
    end

    context "アカウントが存在しない場合" do
      let(:user_id) { 10_000_000_000 }

      it "404エラーとエラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:not_found)
        expect(json_response["error"]).to eq("アカウントが見つかりません")
      end
    end
  end
end
