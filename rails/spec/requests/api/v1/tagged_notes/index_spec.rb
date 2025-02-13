require "rails_helper"

RSpec.describe "Api::V1::TaggedNotes GET /api/v1/tags/:name/tagged_notes", type: :request do
  subject { get(api_v1_tagged_notes_path(name, params)) }

  let(:tag) { create(:tag) }
  let(:name) { tag.name }
  let(:params) { nil }

  before { create_list(:note_tag, 11, tag:) }

  include_examples "リソース不在エラー", "タグ", "name"

  context "タグが存在する場合" do
    include_examples "ページネーションのテスト", "ノート"
  end
end
