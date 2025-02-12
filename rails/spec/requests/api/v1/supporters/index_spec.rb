require "rails_helper"

RSpec.describe "Api::V1::Supporters GET /api/v1/:name/notes/:note_slug/supporters", type: :request do
  subject { get(api_v1_user_note_supporters_path(name, note_slug, params)) }

  let(:note) { create(:note) }
  let(:name) { note.user.name }
  let(:note_slug) { note.slug }
  let(:params) { nil }

  before { create_list(:cheer, 41, note:) }

  include_examples "リソース不在エラー", "ノート", "note_slug"
  include_examples "ノート非公開エラー"
  include_examples "ページネーションのテスト", "アカウント"
end
