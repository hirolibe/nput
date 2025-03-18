require "rails_helper"

RSpec.describe "Api::V1::MyFiledNotes GET /api/v1/folders/:folder_name/my_filed_notes", type: :request do
  subject { get(api_v1_my_filed_notes_path(folder_name), headers:, params:) }

  let(:user) { create(:user) }
  let(:folder) { create(:folder, user:) }
  let(:folder_name) { folder.folder_name }

  let(:headers) { { Authorization: "Bearer token" } }
  let(:params) { nil }

  before do
    stub_token_verification.and_return({ "sub" => user.uid })
    create_list(:note_folder, 11, folder:)
  end

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    include_examples "リソース不在エラー", "フォルダ", "folder_name"

    context "フォルダが存在する場合" do
      include_examples "ページネーションのテスト", "ノート"
    end
  end
end
