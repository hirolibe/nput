RSpec.shared_examples "トークン欠落エラー" do
  before do
    headers.merge!({ Authorization: nil })
  end

  it "400エラーとエラーメッセージが返る" do
    subject
    expect(response).to have_http_status(:bad_request)
    expect(json_response["error"]).to eq("トークンが見つかりません　新規登録またはログインしてください")
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
    expect(json_response["error"]).to eq("認証情報が無効です　ログインし直してください")
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

RSpec.shared_examples "ユーザー認証エラー" do
  context "トークンが欠落している場合" do
    include_examples "トークン欠落エラー"
  end

  context "トークンの有効期限が切れている場合" do
    include_examples "トークン期限切れエラー"
  end

  context "無効なトークンを受け取り、ユーザー情報を取得できなかった場合" do
    include_examples "トークン無効エラー"
  end

  context "有効なトークンを受け取ったが、データベースにアカウントが存在しなかった場合" do
    include_examples "アカウントエラー"
  end
end
