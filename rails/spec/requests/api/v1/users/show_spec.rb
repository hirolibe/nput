require "rails_helper"

RSpec.describe "Api::V1::Users GET /api/v1/users/:id", type: :request do
  subject { get(api_v1_user_path(user_id)) }

  let(:user) { create(:user) }
  let(:user_id) { user.id }

  include_examples "リソース不在エラー", "アカウント", "user_id"

  context "アカウントが存在する場合" do
    it "200ステータス、プロフィールの情報、ノートの情報が返る" do
      subject
      expect(response).to have_http_status(:ok)
      expect(json_response.keys).to eq ["id", "profile"]
      expect(json_response["profile"].keys).to eq ["id", "nickname", "bio", "x_username", "github_username", "cheer_points", "avatar_url"]
    end
  end
end
