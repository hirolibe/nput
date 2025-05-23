RSpec.shared_examples "トークン欠落エラー" do
  before { headers.merge!({ Authorization: nil }) }

  it "400エラーとエラーメッセージが返る" do
    subject
    expect(response).to have_http_status(:bad_request)
    expect(json_response["error"]).to eq("トークンが見つかりません")
  end
end

RSpec.shared_examples "トークン期限切れエラー" do
  before do
    allow(Rails.logger).to receive(:error)
    stub_token_verification.and_raise(StandardError, "トークンが期限切れです")
  end

  it "トークンの検証が失敗し、401エラーとエラーメッセージが返る" do
    subject
    expect(response).to have_http_status(:unauthorized)
    expect(Rails.logger).to have_received(:error).with("トークンが期限切れです")
    expect(json_response["error"]).to eq("トークンが期限切れです")
  end
end

RSpec.shared_examples "トークン無効エラー" do
  before { stub_token_verification.and_return(nil) }

  it "トークンの検証が失敗し、401エラーとエラーメッセージが返る" do
    subject
    expect(response).to have_http_status(:unauthorized)
    expect(json_response["error"]).to eq("認証情報が無効です")
  end
end

RSpec.shared_examples "アカウントエラー" do
  before { stub_token_verification.and_return({ "sub" => "no_account_uid" }) }

  it "認証が失敗し、401エラーとエラーメッセージが返る" do
    subject
    expect(response).to have_http_status(:unauthorized)
    expect(json_response["error"]).to eq("アカウント登録が完了していません")
  end
end

RSpec.shared_examples "トークン検証エラー" do
  context "トークンが欠落している場合" do
    include_examples "トークン欠落エラー"
  end

  context "トークンの有効期限が切れている場合" do
    include_examples "トークン期限切れエラー"
  end

  context "無効なトークンを受け取り、ユーザー情報を取得できなかった場合" do
    include_examples "トークン無効エラー"
  end
end

RSpec.shared_examples "ユーザー認証エラー" do
  include_examples "トークン検証エラー"

  context "有効なトークンを受け取ったが、データベースにアカウントが存在しなかった場合" do
    include_examples "アカウントエラー"
  end
end

RSpec.shared_examples "管理者認証エラー" do
  context "管理者以外の場合" do
    let(:non_administrator) { create(:user, role: "user") }

    before do
      stub_token_verification.and_return({ "sub" => non_administrator.uid })
    end

    it "認証が失敗し、403エラーとエラーメッセージが返る" do
      subject
      expect(response).to have_http_status(:forbidden)
      expect(json_response["error"]).to eq("アクセス権限がありません")
    end
  end
end
