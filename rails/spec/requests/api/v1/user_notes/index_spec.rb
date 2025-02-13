require "rails_helper"

RSpec.describe "Api::V1::UserNotes GET /api/v1/:name/user_notes", type: :request do
  subject { get(api_v1_user_user_notes_path(name, params)) }

  let(:user) { create(:user) }
  let(:name) { user.name }
  let(:params) { nil }

  before do
    create_list(:note, 11, user:, status: :published)
    create_list(:note, 10, user:, status: :draft)
  end

  include_examples "リソース不在エラー", "アカウント", "name"
  include_examples "ページネーションのテスト", "ノート"
end
