require "rails_helper"

RSpec.describe "Api::V1::MyFolders DELETE /api/v1/my_folders/:folder_slug", type: :request do
  subject { delete(api_v1_my_folder_path(folder_slug), headers:) }

  let(:user) { create(:user) }
  let(:folder) { create(:folder, user:) }
  let(:folder_slug) { folder.slug }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    include_examples "リソース不在エラー", "フォルダ", "folder_slug"
    include_examples "リソースの削除成功", "フォルダ"
  end
end
