require "rails_helper"

RSpec.describe "Api::V1::Auth::Registrations POST /api/v1/auth/registration", type: :request do
  subject { post api_v1_auth_registration_path, headers: }

  let(:headers) { { Authorization: "Bearer token" } }

  context "トークンが欠落している場合" do
    include_examples "トークン欠落エラー"
  end

  context "トークンの有効期限が切れている場合" do
    include_examples "トークン期限切れエラー"
  end

  context "無効なトークンを受け取り、ユーザー情報を取得できなかった場合" do
    include_examples "トークン無効エラー"
  end

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
      expect(user.cheer_points).to eq(0)
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
