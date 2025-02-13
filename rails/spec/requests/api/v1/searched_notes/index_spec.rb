require "rails_helper"

RSpec.describe "Api::V1::SearchedNotes GET /api/v1/searched_notes", type: :request do
  subject { get(api_v1_searched_notes_path(params)) }

  let(:tag) { create(:tag) }
  let(:params) { { page: nil, q: tag.name } }

  before { create_list(:note_tag, 11, tag:) }

  include_examples "ページネーションのテスト", "検索したノート"
end
