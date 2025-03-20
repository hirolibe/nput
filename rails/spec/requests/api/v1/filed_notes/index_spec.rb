require "rails_helper"

RSpec.describe "Api::V1::FiledNotes GET /api/v1/:name/folders/:slug/filed_notes", type: :request do
  subject { get(api_v1_user_filed_notes_path(name, slug, params)) }

  let(:user) { create(:user) }
  let(:name) { user.name }
  let(:folder) { create(:folder, user:) }
  let(:slug) { folder.slug }
  let(:params) { nil }

  before { create_list(:note_folder, 11, folder:) }

  include_examples "リソース不在エラー", "アカウント", "name"
  include_examples "リソース不在エラー", "フォルダ", "slug"

  context "アカウントとフォルダが存在する場合" do
    include_examples "ページネーションのテスト", "ノート"
  end
end
