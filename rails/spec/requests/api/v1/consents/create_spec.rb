require "rails_helper"

RSpec.describe "Api::V1::Consents POST /api/v1/consents", type: :request do
  subject { post(api_v1_consents_path, headers:, params:) }

  let(:current_user) { create(:user) }
  let(:headers) { { Authorization: "Bearer token" } }
  let(:params) { { consent: { terms_version: "1.0", privacy_version: "1.0", consent_date: Time.current } } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => current_user.uid }) }

    context "バリデーションに失敗した場合" do
      let(:params) { { consent: { terms_version: "", privacy_version: "1.0", consent_date: Time.current } } }

      include_examples "バリデーションエラーのレスポンス検証"
    end

    context "バリデーションに成功した場合" do
      it "コメントが新規作成され、201ステータスが返る" do
        expect { subject }.to change { current_user.consents.count }.by(1)
        expect(response).to have_http_status(:created)
      end
    end
  end
end
