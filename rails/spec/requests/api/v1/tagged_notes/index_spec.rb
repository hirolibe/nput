require "rails_helper"

RSpec.describe "Api::V1::TaggedNotes GET /api/v1/tags/:tag_id/tagged_notes", type: :request do
  subject { get(api_v1_tag_tagged_notes_path(tag_id, params)) }

  let(:tag) { create(:tag) }
  let(:tag_id) { tag.id }
  let(:params) { nil }

  before { create_list(:note_tag, 20, tag:) }

  include_examples "リソース不在エラー", "タグ", "tag_id"

  context "タグが存在する場合" do
    include_examples "ページネーションのテスト", "ノート"
  end
end
