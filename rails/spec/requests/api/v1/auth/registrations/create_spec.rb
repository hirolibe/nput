require "rails_helper"

RSpec.describe "Api::V1::Auth::Registrations POST /api/v1/auth/registration", type: :request do
  subject { post api_v1_auth_registration_path, headers: }

  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "トークン検証エラー"

  context "有効なトークンを受け取り、ユーザー情報を取得できた場合" do
    subject { post api_v1_auth_registration_path, params: params.to_json, headers: }

    let(:uid) { Faker::Internet.uuid }
    let(:email) { Faker::Internet.email }
    let(:params) { { name: generate_unique_username, terms_version: "1", privacy_version: "1", agreed_at: Time.current } }
    let(:headers) { { "Content-Type" => "application/json", Authorization: "Bearer token" } }
    let(:user) { User.last }

    before { stub_token_verification.and_return({ "sub" => uid, "email" => email }) }

    it "ユーザーとプロフィールが新規作成され、201ステータスと新規登録成功のメッセージが返る" do
      expect { subject }.to change { User.count }.by(1) and
        expect(Profile.last.user).to eq(user)
      expect(response).to have_http_status(:created)
      expect(user.uid).to eq(uid)
      expect(user.email).to eq(email)
      expect(user.name).to eq(params[:name])
      expect(user.terms_version).to eq(params[:terms_version])
      expect(user.privacy_version).to eq(params[:privacy_version])
      expect(user.agreed_at).to be_within(1.second).of(params[:agreed_at])
      expect(user.role).to eq("user")
      expect(user.guest).to be(false)
      expect(json_response["message"]).to eq("新規登録に成功しました！")
    end
  end

  private

    def generate_unique_username
      generated_name = nil
      5.times do
        temp_name = Faker::Internet.username[0..19]
        filtered_name = temp_name.gsub(/[^a-zA-Z0-9_-]/, "")
        next unless !User.exists?(name: filtered_name) &&
                    filtered_name.match?(/\A[a-zA-Z0-9_][a-zA-Z0-9_-]*[a-zA-Z0-9_]\z/) &&
                    !filtered_name.start_with?("-") &&
                    !filtered_name.end_with?("-")

        generated_name = filtered_name
        break
      end

      generated_name || "user_#{SecureRandom.hex(4)}"
    end
end
