require "rails_helper"

RSpec.describe "Api::V1::Auth::Registrations", type: :request do
  describe "POST /api/v1/auth/registrations" do
    subject { post api_v1_auth_registrations_path, params:, headers: }

    let(:headers) { { Authorization: "Bearer token" } }
    let(:params) { { name: Faker::Name.name } }

    context "トークンが欠落している場合" do
      before do
        headers.merge!({ Authorization: nil })
      end

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
      let(:uid) { Faker::Internet.uuid }
      let(:email) { Faker::Internet.email }
      let(:user) { User.last }

      before do
        stub_token_verification.and_return({ "sub" => uid, "email" => email })
      end

      it "201ステータスとユーザー登録成功のメッセージが返る" do
        expect { subject }.to change { User.count }.by(1)
        expect(response).to have_http_status(:created)
        expect(user.uid).to eq(uid)
        expect(user.email).to eq(email)
        expect(user.name).to eq(params[:name])
        expect(json_response["message"]).to eq("ユーザー登録に成功しました！")
      end
    end
  end
end
