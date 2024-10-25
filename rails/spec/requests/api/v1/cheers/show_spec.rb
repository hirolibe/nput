require "rails_helper"

RSpec.describe "Api::V1::Cheers GET /api/v1/notes/:note_id/cheer", type: :request do
  subject { get(api_v1_note_cheer_path(note_id), headers:) }

  let(:headers) { { Authorization: "Bearer token" } }
  let(:user) { create(:user) }
  let(:note) { create(:note) }
  let(:note_id) { note.id }

  before { create(:cheer, user:, note:) }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    include_examples "リソース不在エラー", "ノート", "note_id"

    context "ノートが存在する場合" do
      context "ノートのステータスが公開中の場合" do
        it "200ステータスとチアー状態の情報が返る" do
          subject
          expect(response).to have_http_status(:ok)
          expect(json_response.keys).to eq ["cheer_status"]
          expect(json_response["cheer_status"]).to be true
        end
      end

      context "ノートのステータスが下書きの場合" do
        let(:note) { create(:note, status: :draft) }

        include_examples "404エラー", "ノート"
      end
    end
  end
end
