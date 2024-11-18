require "rails_helper"

RSpec.describe "Api::V1::Cheers GET /api/v1/notes/:note_id/cheer", type: :request do
  subject { get(api_v1_note_cheer_path(note_id), headers:) }

  let(:user) { create(:user) }
  let(:note) { create(:note) }
  let(:note_id) { note.id }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    include_examples "リソース不在エラー", "ノート", "note_id"
    include_examples "ノート非公開エラー"

    context "ステータスが公開中のノートが存在する場合" do
      before { create(:cheer, note:, user:) }

      it "200ステータス、エール状態が返る" do
        subject
        expect(json_response["has_cheered"]).to be true
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
