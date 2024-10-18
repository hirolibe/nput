require "rails_helper"

RSpec.describe "Api::V1::Users", type: :request do
  describe "GET /show" do
    subject { get(api_v1_user_path(user_id)) }

    context "アカウントが存在する場合" do
      let(:user) { create(:user) }
      let(:user_id) { user.id }

      it "200ステータスとノートの情報が返る" do
        subject
        expect(response).to have_http_status(:ok)
        expect(json_response.keys).to eq ["id", "display_name", "bio", "avatar_url", "sns_link_x", "sns_link_github", "cheer_points"]
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
