require "rails_helper"

RSpec.describe "Api::V1::Notes DELETE /api/v1/notes/:id", type: :request do
  subject { delete(api_v1_note_path(note_id), headers:) }

  let(:user) { create(:user) }
  let(:note) { create(:note, user:) }
  let(:note_id) { note.id }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    include_examples "ノートアクセスエラー"

    include_examples "リソースの削除成功", "ノート"
  end
end
