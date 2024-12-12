require "rails_helper"

RSpec.describe "Api::V1::Users GET /api/v1/:name", type: :request do
  subject { get(api_v1_user_path(name)) }

  let(:user) { create(:user) }
  let(:name) { user.name }

  include_examples "リソース不在エラー", "アカウント", "name"

  context "アカウントが存在する場合" do
    it "200ステータス、プロフィールの情報、ノートの情報が返る" do
      subject
      expect(response).to have_http_status(:ok)
      expect(json_response.keys).to eq EXPECTED_USER_KEYS
      expect(json_response["profile"].keys).to eq EXPECTED_PROFILE_KEYS
    end
  end
end
