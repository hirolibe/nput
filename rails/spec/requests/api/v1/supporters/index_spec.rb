require "rails_helper"

RSpec.describe "Api::V1::Supporters GET /api/v1/:name/notes/:note_id/supporters", type: :request do
  subject { get(api_v1_user_note_supporters_path(name, note_id, params)) }

  let(:note) { create(:note) }
  let(:name) { note.user.name }
  let(:note_id) { note.id }
  let(:params) { nil }

  before { create_list(:cheer, 20, note:) }

  include_examples "リソース不在エラー", "ノート", "note_id"
  include_examples "ノート非公開エラー"
  include_examples "ページネーションのテスト", "アカウント"
end
