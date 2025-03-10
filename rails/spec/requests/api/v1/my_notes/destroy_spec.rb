require "rails_helper"

RSpec.describe "Api::V1::MyNotes DELETE /api/v1/my_notes/:id", type: :request do
  subject { delete(api_v1_my_note_path(note_slug), headers:) }

  let(:user) { create(:user) }
  let(:note) { create(:note, user:) }
  let(:note_slug) { note.slug }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    include_examples "リソース不在エラー", "ノート", "note_slug"
    include_examples "アクセス権限エラー", "ノート", "note"
    include_examples "リソースの削除成功", "ノート"
  end
end
