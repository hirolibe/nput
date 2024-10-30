RSpec.shared_examples "バリデーションエラーのレスポンス検証" do
  it "422エラーとエラーメッセージが返る" do
    subject
    expect(response).to have_http_status(:unprocessable_entity)
    expect(json_response.keys).to eq ["errors"]
    expect(json_response["errors"]).to be_present
  end
end
