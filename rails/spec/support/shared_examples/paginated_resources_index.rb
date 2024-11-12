RSpec.shared_examples "ノートとページのレスポンス検証" do |page|
  it "200ステータス、#{page}ページ目のノートとページの情報が返る" do
    subject
    expect(response).to have_http_status(:ok)
    expect(json_response.keys).to eq ["notes", "meta"]
    expect(json_response["notes"][0].keys).to eq EXPECTED_NOTE_INDEX_KEYS
    expect(json_response["notes"][0]["user"].keys).to eq EXPECTED_BASIC_USER_KEYS
    expect(json_response["notes"][0]["user"]["profile"].keys).to eq EXPECTED_PROFILE_KEYS
    expect(json_response["notes"][0]["tags"][0].keys).to eq EXPECTED_TAG_KEYS
    expect(json_response["meta"].keys).to eq ["current_page", "total_pages"]
    expect(json_response["meta"]["current_page"]).to eq page
    expect(json_response["meta"]["total_pages"]).to eq 2
  end
end

RSpec.shared_examples "アカウントとページのレスポンス検証" do |page|
  it "200ステータス、#{page}ページ目のアカウントとページの情報が返る" do
    subject
    expect(response).to have_http_status(:ok)
    expect(json_response.keys).to eq ["users", "meta"]
    expect(json_response["users"][0].keys).to eq EXPECTED_BASIC_USER_KEYS
    expect(json_response["users"][0]["profile"].keys).to eq EXPECTED_PROFILE_KEYS
    expect(json_response["meta"].keys).to eq ["current_page", "total_pages"]
    expect(json_response["meta"]["current_page"]).to eq page
    expect(json_response["meta"]["total_pages"]).to eq 2
  end
end

RSpec.shared_examples "ページネーションのテスト" do |resource_name|
  context "paramsにpageの値が含まれていない場合" do
    let(:params) { nil }

    include_examples "#{resource_name}とページのレスポンス検証", 1
  end

  context "paramsに含まれるpageの値が2の場合" do
    let(:params) { { page: 2 } }

    include_examples "#{resource_name}とページのレスポンス検証", 2
  end
end
