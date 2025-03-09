require "rails_helper"

RSpec.describe "Api::V1::Auth::Registrations POST /api/v1/auth/registration", type: :request do
  subject { post(api_v1_auth_registration_path, headers:) }

  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "トークン検証エラー"

  context "有効なトークンを受け取った場合" do
    subject { post api_v1_auth_registration_path, headers:, params: }

    let(:uid) { Faker::Internet.uuid }
    let(:email) { Faker::Internet.email }
    let(:headers) { { Authorization: "Bearer token" } }
    let(:common_params) do
      {
        terms_version: "1.0",
        privacy_version: "1.0",
        consent_date: Time.current,
      }
    end

    before { stub_token_verification.and_return({ "sub" => uid, "email" => email }) }

    context "バリデーションに失敗した場合" do
      let(:name) { "" }
      let(:params) { { name: }.merge(common_params) }

      include_examples "バリデーションエラーのレスポンス検証"
    end

    context "バリデーションに成功した場合" do
      let(:name) { generate_unique_username }
      let(:params) { { name: }.merge(common_params) }
      let(:user) { User.last }

      it "ユーザーとプロフィールが新規作成され、201ステータスと新規登録成功のメッセージが返る" do
        expect { subject }.to change { User.count }.by(1) and
          expect(Profile.last.user).to eq(user)
        expect(response).to have_http_status(:created)
        expect(user.uid).to eq(uid)
        expect(user.email).to eq(email)
        expect(user.name).to eq(params[:name])
        expect(user.role).to eq("user")
        expect(user.guest).to be(false)
        expect(json_response["message"]).to eq("新規登録に成功しました！")
      end
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
