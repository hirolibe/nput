require "rails_helper"

RSpec.describe "Api::V1::Folders PATCH /api/v1/:name/folders/:folder_name", type: :request do
  subject { patch(api_v1_user_folder_path(name, folder_name), headers:, params:) }

  let(:user) { create(:user) }
  let(:name) { user.name }
  let(:folder) { create(:folder, user:) }
  let(:folder_name) { folder.folder_name }
  let(:headers) { { Authorization: "Bearer token" } }
  let(:params) { "valid_params" }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    context  "フォルダが存在しない場合" do
      let(:folder_name) { "non_exist_name" }

      include_examples "404エラー", "フォルダ"
    end

    context "フォルダが存在する場合" do
      context "バリデーションに失敗した場合" do
        let(:params) { { folder: { folder_name: "" } } }

        include_examples "バリデーションエラーのレスポンス検証"
      end

      context "バリデーションに成功した場合" do
        let(:params) { { folder: { folder_name: "更新後のフォルダ名" } } }

        it "フォルダ名が更新され、200ステータスとメッセージが返る" do
          subject
          expect(folder.reload).to have_attributes(folder_name: "更新後のフォルダ名")
          expect(response).to have_http_status(:ok)
          expect(json_response["message"]).to eq("フォルダ名を更新しました！")
        end
      end
    end
  end
end
