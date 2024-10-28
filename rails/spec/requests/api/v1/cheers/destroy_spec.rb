require "rails_helper"

RSpec.describe "Api::V1::Cheers DELETE /api/v1/notes/:note_id/cheer", type: :request do
  subject { delete(api_v1_note_cheer_path(note_id), headers:) }

  let(:user) { create(:user) }
  let(:note) { create(:note) }
  let(:note_id) { note.id }
  let(:cheer) { create(:cheer, user:, note:) }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    include_examples "リソース不在エラー", "ノート", "note_id"
    include_examples "ノート非公開エラー"

    context "ステータスが公開中のノートに、すでにエールしている場合" do
      before { user.cheers.create!(note_id:) }

      it "エールを削除でき、200ステータスとエール状態の情報が返る" do
        subject
        expect(response).to have_http_status(:ok)
        expect(json_response["cheer_status"]).to be false
      end
    end

    context "ノートにエールしていない状態の場合" do
      it "422エラーとエラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response["error"]).to eq("まだこのノートにエールしていません")
      end
    end
  end
end
