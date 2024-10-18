require "rails_helper"

RSpec.describe "Api::V1::Notes GET /api/v1/notes", type: :request do
  subject { get(api_v1_notes_path(params)) }

  before do
    create_list(:note, 25, status: :published)
    create_list(:note, 8, status: :draft)
  end

  context "paramsにpageのクエリが含まれていない場合" do
    let(:params) { nil }

    it "200ステータス、1ページ目のレコード、ページ情報が返る" do
      subject
      expect(response).to have_http_status(:ok)
      expect(json_response.keys).to eq ["notes", "meta"]
      expect(json_response["notes"][0].keys).to eq ["id", "title", "from_today", "user"]
      expect(json_response["notes"][0]["user"].keys).to eq ["id", "display_name", "bio", "avatar_url", "sns_link_x", "sns_link_github", "cheer_points"]
      expect(json_response["meta"].keys).to eq ["current_page", "total_pages"]
      expect(json_response["meta"]["current_page"]).to eq 1
    end
  end

  context "paramsに存在するpageのクエリを含む場合" do
    let(:params) { { page: 2 } }

    it "200ステータス、該当ページのレコード、ページ情報が返る" do
      subject
      expect(response).to have_http_status(:ok)
      expect(json_response.keys).to eq ["notes", "meta"]
      expect(json_response["notes"][0].keys).to eq ["id", "title", "from_today", "user"]
      expect(json_response["notes"][0]["user"].keys).to eq ["id", "display_name", "bio", "avatar_url", "sns_link_x", "sns_link_github", "cheer_points"]
      expect(json_response["meta"].keys).to eq ["current_page", "total_pages"]
      expect(json_response["meta"]["current_page"]).to eq 2
    end
  end
end
