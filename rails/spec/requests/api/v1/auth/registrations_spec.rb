require "rails_helper"

RSpec.describe "Api::V1::Auth::Registrations", type: :request do
  describe "POST /api/v1/auth/registrations" do
    subject { post api_v1_auth_registrations_path, params:, headers: }

    let(:headers) { { Authorization: "Bearer token" } }
    let(:params) { { name: Faker::Name.name } }

    context "トークンが欠落している場合" do
      include_examples "トークン欠落エラー"
    end

    context "トークンの有効期限が切れている場合" do
      include_examples "トークン期限切れエラー"
    end

    context "無効なトークンを受け取り、ユーザー情報を取得できなかった場合" do
      before do
        stub_token_verification.and_return(nil)
      end

      it "トークンの検証が失敗し、401エラーとエラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:unauthorized)
        expect(json_response["error"]).to eq("認証情報が無効です　登録し直してください")
      end
    end

    context "有効なトークンを受け取り、ユーザー情報を取得できた場合" do
      before do
        stub_token_verification.and_return({ "sub" => Faker::Internet.uuid, "email" => Faker::Internet.email })
      end

      it "201ステータスとユーザー登録成功のメッセージが返る" do
        subject
        expect(response).to have_http_status(:created)
        expect(json_response["message"]).to eq("ユーザー登録に成功しました！")
      end
    end
  end
end
