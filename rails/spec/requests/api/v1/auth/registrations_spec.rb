require "rails_helper"

RSpec.describe "Api::V1::Auth::Registrations POST /api/v1/auth/registration", type: :request do
  subject { post api_v1_auth_registration_path, headers: }

  let(:headers) { { Authorization: "Bearer token" } }

  context "トークンが欠落している場合" do
    before { headers.merge!({ Authorization: nil }) }

    it "400エラーとエラーメッセージが返る" do
      subject
      expect(response).to have_http_status(:bad_request)
      expect(json_response["error"]).to eq("トークンが見つかりません　新規登録し直してください")
    end
  end

  context "トークンの有効期限が切れている場合" do
    include_examples "トークン期限切れエラー"
  end

  context "無効なトークンを受け取り、ユーザー情報を取得できなかった場合" do
    before { stub_token_verification.and_return(nil) }

    it "トークンの検証が失敗し、401エラーとエラーメッセージが返る" do
      subject
      expect(response).to have_http_status(:unauthorized)
      expect(json_response["error"]).to eq("認証情報が無効です　登録し直してください")
    end
  end

  context "有効なトークンを受け取り、ユーザー情報を取得できた場合" do
    let(:uid) { Faker::Internet.uuid }
    let(:email) { Faker::Internet.email }
    let(:user) { User.last }

    before { stub_token_verification.and_return({ "sub" => uid, "email" => email }) }

    it "201ステータスとユーザー登録成功のメッセージが返る" do
      expect { subject }.to change { User.count }.by(1)
      expect(response).to have_http_status(:created)
      expect(user.uid).to eq(uid)
      expect(user.email).to eq(email)
      expect(user.cheer_points).to eq(0)
      expect(json_response["message"]).to eq("ユーザー登録に成功しました！")
    end
  end
end
