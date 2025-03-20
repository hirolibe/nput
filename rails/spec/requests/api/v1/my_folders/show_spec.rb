require "rails_helper"

RSpec.describe "Api::V1::MyFolders GET /api/v1/my_folders/:folder_slug", type: :request do
  subject { get(api_v1_my_folder_path(folder_slug), headers:) }

  let(:user) { create(:user) }
  let(:folder) { create(:folder, user:) }
  let(:folder_slug) { folder.slug }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    context "フォルダ名が存在しない場合" do
      let(:folder_slug) { "non_exist_slug" }

      include_examples "404エラー", "フォルダ"
    end

    context "フォルダ名が存在する場合" do
      it "200ステータス、フォルダの情報が返る" do
        subject
        expect(response).to have_http_status(:ok)
        expect(json_response.keys).to eq EXPECTED_FOLDER_KEYS
      end
    end
  end
end
