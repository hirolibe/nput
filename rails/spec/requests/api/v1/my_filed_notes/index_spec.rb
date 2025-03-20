require "rails_helper"

RSpec.describe "Api::V1::MyFiledNotes GET /api/v1/my_folders/:folder_slug/my_filed_notes", type: :request do
  subject { get(api_v1_my_filed_notes_path(folder_slug), headers:, params:) }

  let(:user) { create(:user) }
  let(:folder) { create(:folder, user:) }
  let(:folder_slug) { folder.slug }

  let(:headers) { { Authorization: "Bearer token" } }
  let(:params) { nil }

  before do
    stub_token_verification.and_return({ "sub" => user.uid })
    create_list(:note_folder, 11, folder:)
  end

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    include_examples "リソース不在エラー", "フォルダ", "folder_slug"

    context "フォルダが存在する場合" do
      include_examples "ページネーションのテスト", "ノート"
    end
  end
end
