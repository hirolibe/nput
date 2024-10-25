RSpec.shared_examples "ページネーション付きノート一覧の取得" do
  context "paramsにpageのクエリが含まれていない場合" do
    let(:params) { nil }

    it "200ステータス、1ページ目のレコード、ページ情報が返る" do
      subject
      expect(response).to have_http_status(:ok)
      expect(json_response.keys).to eq ["notes", "meta"]
      expect(json_response["notes"][0].keys).to eq ["id", "title", "from_today", "user"]
      expect(json_response["notes"][0]["user"].keys).to eq ["id", "profile"]
      expect(json_response["notes"][0]["user"]["profile"].keys).to eq ["id", "nickname", "bio", "x_username", "github_username", "cheer_points", "avatar_url"]
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
      expect(json_response["notes"][0]["user"].keys).to eq ["id", "profile"]
      expect(json_response["notes"][0]["user"]["profile"].keys).to eq ["id", "nickname", "bio", "x_username", "github_username", "cheer_points", "avatar_url"]
      expect(json_response["meta"].keys).to eq ["current_page", "total_pages"]
      expect(json_response["meta"]["current_page"]).to eq 2
    end
  end
end
