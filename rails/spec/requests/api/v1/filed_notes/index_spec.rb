require "rails_helper"

RSpec.describe "Api::V1::FiledNotes GET /api/v1/:name/folders/:folder_name/filed_notes", type: :request do
  subject { get(api_v1_user_filed_notes_path(name, folder_name, params)) }

  let(:user) { create(:user) }
  let(:name) { user.name }
  let(:folder) { create(:folder, user:) }
  let(:folder_name) { folder.folder_name }
  let(:params) { nil }

  before { create_list(:note_folder, 11, folder:) }

  include_examples "リソース不在エラー", "アカウント", "name"
  include_examples "リソース不在エラー", "フォルダ", "folder_name"

  context "アカウントとフォルダが存在する場合" do
    include_examples "ページネーションのテスト", "ノート"
  end
end
