require "rails_helper"

RSpec.describe "Api::V1::Folders DELETE /api/v1/:name/folder", type: :request do
  subject { delete(api_v1_user_folder_path(name, folder_name), headers:) }

  let(:user) { create(:user) }
  let(:name) { user.name }
  let(:folder) { create(:folder, user:) }
  let(:folder_name) { folder.folder_name }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    include_examples "リソース不在エラー", "フォルダ", "folder_name"
    include_examples "リソースの削除成功", "フォルダ"
  end
end
