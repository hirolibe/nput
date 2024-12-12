require "rails_helper"

RSpec.describe "Api::V1::CheeredNotes GET /api/v1/:name/cheered_notes", type: :request do
  subject { get(api_v1_user_cheered_notes_path(name, params)) }

  let(:user) { create(:user) }
  let(:name) { user.name }
  let(:params) { nil }

  before { create_list(:cheer, 20, user:) }

  include_examples "リソース不在エラー", "アカウント", "name"

  context "アカウントが存在する場合" do
    include_examples "ページネーションのテスト", "ノート"
  end
end
