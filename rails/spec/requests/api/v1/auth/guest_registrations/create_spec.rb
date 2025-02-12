require "rails_helper"

RSpec.describe "Api::V1::Auth::GuestRegistrations POST /api/v1/auth/guest_registration", type: :request do
  subject { post api_v1_auth_guest_registration_path, headers: }

  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "トークン検証エラー"

  context "有効なトークンを受け取り、ユーザー情報を取得できた場合" do
    subject { post api_v1_auth_guest_registration_path, params: params.to_json, headers: }

    let(:uid) { Faker::Internet.uuid }
    let(:params) { { terms_version: "1", privacy_version: "1", agreed_at: Time.current } }
    let(:headers) { { "Content-Type" => "application/json", Authorization: "Bearer token" } }
    let(:user) { User.last }

    before { stub_token_verification.and_return({ "sub" => uid }) }

    it "ゲストユーザーとプロフィールが新規作成され、201ステータスと新規登録成功のメッセージが返る" do
      expect { subject }.to change { User.count }.by(1) and
        expect(Profile.last.user).to eq(user)
      expect(response).to have_http_status(:created)
      expect(user.uid).to eq(uid)
      expect(user.email).to match(/\Aguest_[a-f0-9]{10}@example\.com\z/)
      expect(user.name).to match(/\AGuest_[a-f0-9]{10}\z/)
      expect(user.terms_version).to eq(params[:terms_version])
      expect(user.privacy_version).to eq(params[:privacy_version])
      expect(user.agreed_at).to be_within(1.second).of(params[:agreed_at])
      expect(user.role).to eq("user")
      expect(user.guest).to be(true)
      expect(json_response["message"]).to eq("ゲストとしてログインしました！")
    end
  end
end
