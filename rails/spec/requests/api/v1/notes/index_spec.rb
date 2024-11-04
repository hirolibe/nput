require "rails_helper"

RSpec.describe "Api::V1::Notes GET /api/v1/notes", type: :request do
  subject { get(api_v1_notes_path(params)) }

  before do
    create_list(:note, 20, status: :published)
    create_list(:note, 1, status: :draft)
  end

  include_examples "ページネーションのテスト", "ノート"
end
