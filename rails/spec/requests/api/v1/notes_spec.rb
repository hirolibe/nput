require "rails_helper"

RSpec.describe "Api::V1::Notes", type: :request do
  describe "GET /api/v1/notes" do
    subject { get(api_v1_notes_path(params)) }

    before do
      create_list(:note, 25, status: :published)
      create_list(:note, 8, status: :draft)
    end

    context "paramsにpageのクエリが含まれていない場合" do
      let(:params) { nil }

      it "1ページ目のレコード10件取得できる" do
        subject
        expect(json_response.keys).to eq ["notes", "meta"]
        expect(json_response["notes"].length).to eq 10
        expect(json_response["notes"][0].keys).to eq ["id", "title", "published_at", "author_name", "from_today", "user"]
        expect(json_response["notes"][0]["user"].keys).to eq ["name", "email"]
        expect(json_response["meta"].keys).to eq ["current_page", "total_pages"]
        expect(json_response["meta"]["current_page"]).to eq 1
        expect(json_response["meta"]["total_pages"]).to eq 3
        expect(response).to have_http_status(:ok)
      end
    end

    context "paramsにpageのクエリを含む場合" do
      let(:params) { { page: 2 } }

      it "該当ページ目のレコード10件取得できる" do
        subject
        expect(json_response.keys).to eq ["notes", "meta"]
        expect(json_response["notes"].length).to eq 10
        expect(json_response["notes"][0].keys).to eq ["id", "title", "published_at", "author_name", "from_today", "user"]
        expect(json_response["notes"][0]["user"].keys).to eq ["name", "email"]
        expect(json_response["meta"].keys).to eq ["current_page", "total_pages"]
        expect(json_response["meta"]["current_page"]).to eq 2
        expect(json_response["meta"]["total_pages"]).to eq 3
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
