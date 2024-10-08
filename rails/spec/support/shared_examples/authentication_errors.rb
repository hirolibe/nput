RSpec.shared_examples "トークン欠落エラー" do
  before do
    headers.merge!({ Authorization: nil })
  end

  it "400エラーとエラーメッセージが返る" do
    subject
    expect(response).to have_http_status(:bad_request)
    expect(json_response["error"]).to eq("ログインしてください")
  end
end

RSpec.shared_examples "トークン期限切れエラー" do
  before do
    allow(Rails.logger).to receive(:error)
    stub_token_verification.and_raise(StandardError, "トークンが期限切れです　ログインし直してください")
  end

  it "トークンの検証が失敗し、401エラーとエラーメッセージが返る" do
    subject
    expect(response).to have_http_status(:unauthorized)
    expect(Rails.logger).to have_received(:error).with("Firebase認証エラー: トークンが期限切れです　ログインし直してください")
    expect(json_response["error"]).to eq("トークンが期限切れです　ログインし直してください")
  end
end

RSpec.shared_examples "トークン無効エラー" do
  before do
    stub_token_verification.and_return(nil)
  end

  it "トークンの検証が失敗し、401エラーとエラーメッセージが返る" do
    subject
    expect(response).to have_http_status(:unauthorized)
    expect(json_response["error"]).to eq("認証情報が無効です　登録し直してください")
  end
end

RSpec.shared_examples "アカウントエラー" do
  before do
    stub_token_verification.and_return({ "sub" => "no_account_uid" })
  end

  it "認証が失敗し、401エラーとエラーメッセージが返る" do
    subject
    expect(response).to have_http_status(:unauthorized)
    expect(json_response["error"]).to eq("アカウントが見つかりません　新規登録してください")
  end
end
