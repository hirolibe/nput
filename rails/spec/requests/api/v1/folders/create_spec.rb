require "rails_helper"

RSpec.describe "Api::V1::Folders POST /api/v1/:name/folder", type: :request do
  subject { post(api_v1_user_folders_path(name), headers:, params:) }

  let(:user) { create(:user) }
  let(:name) { user.name }
  let(:headers) { { Authorization: "Bearer token" } }
  let(:params) { { folder: { folder_name: Faker::Lorem.sentence } } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    context "バリデーションに失敗した場合" do
      let(:params) { { folder: { folder_name: "" } } }

      include_examples "バリデーションエラーのレスポンス検証"
    end

    context "バリデーションに成功した場合" do
      it "フォルダが新規作成され、201ステータスとフォルダの情報が返る" do
        expect { subject }.to change { user.folders.count }
        expect(response).to have_http_status(:created)
        expect(json_response.keys).to eq EXPECTED_FOLDER_KEYS
      end
    end
  end
end
