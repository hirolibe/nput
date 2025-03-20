require "rails_helper"

RSpec.describe "Api::V1::MyFolders PATCH /api/v1/my_folders/:folder_slug", type: :request do
  subject { patch(api_v1_my_folder_path(folder_slug), headers:, params:) }

  let(:user) { create(:user) }
  let(:folder) { create(:folder, user:) }
  let(:folder_slug) { folder.slug }
  let(:headers) { { Authorization: "Bearer token" } }
  let(:params) { "valid_params" }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    context  "フォルダが存在しない場合" do
      let(:folder_slug) { "non_exist_slug" }

      include_examples "404エラー", "フォルダ"
    end

    context "フォルダが存在する場合" do
      context "バリデーションに失敗した場合" do
        let(:params) { { folder: { name: "" } } }

        include_examples "バリデーションエラーのレスポンス検証"
      end

      context "バリデーションに成功した場合" do
        let(:params) { { folder: { name: "更新後のフォルダ名" } } }

        it "フォルダ名が更新され、200ステータスとメッセージが返る" do
          subject
          expect(folder.reload).to have_attributes(name: "更新後のフォルダ名")
          expect(response).to have_http_status(:ok)
          expect(json_response["message"]).to eq("フォルダ名を更新しました！")
        end
      end
    end
  end
end
