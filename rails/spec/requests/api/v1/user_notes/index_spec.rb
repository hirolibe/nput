require "rails_helper"

RSpec.describe "Api::V1::UserNotes GET /api/v1/:name/user_notes", type: :request do
  subject { get(api_v1_user_user_notes_path(name, params)) }

  let(:user) { create(:user) }
  let(:name) { user.name }
  let(:params) { nil }

  before do
    create_list(:note, 20, status: :published, user:)
    create_list(:note, 1, status: :draft, user:)
  end

  include_examples "リソース不在エラー", "アカウント", "name"

  context "アカウントが存在する場合" do
    include_examples "ページネーションのテスト", "ノート"
  end
end
