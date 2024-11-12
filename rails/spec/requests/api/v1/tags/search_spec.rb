require "rails_helper"

RSpec.describe "Api::V1::Tags GET /api/v1/tags/search", type: :request do
  subject { get(search_api_v1_tags_path(params)) }

  let!(:tag_a) { create(:tag, name: "a") }
  let!(:tag_ab) { create(:tag, name: "ab") }
  let!(:tag_c) { create(:tag, name: "c") }

  context "クエリに部分一致または完全一致するタグが存在する場合" do
    let(:params) { { query: "a" } }

    it "200ステータスとクエリに一致する全てのタグの情報が返る" do
      subject
      expect(response).to have_http_status(:ok)
      expect(json_response[0].keys).to eq EXPECTED_TAG_KEYS

      returned_names = json_response.map {|tag| tag["name"] }
      expect(returned_names).to contain_exactly("a", "ab")
      expect(returned_names).not_to include("c")
    end
  end

  context "クエリに一致するタグが存在しない場合" do
    let(:params) { { query: "d" } }

    it "200ステータスとクエリに一致するタグを追加した情報が返る" do
      subject
      expect(response).to have_http_status(:ok)
      expect(json_response[0].keys).to eq EXPECTED_TAG_KEYS

      returned_names = json_response.map {|tag| tag["name"] }
      expect(returned_names).to contain_exactly("d")
      expect(returned_names).to include("d")
    end
  end

  context "クエリが空の場合" do
    let(:params) { { query: "" } }

    it "204ステータスが返る" do
      subject
      expect(response).to have_http_status(:no_content)
    end
  end
end
