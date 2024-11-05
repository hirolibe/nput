require "rails_helper"

RSpec.describe "Api::V1::Cheers DELETE /api/v1/notes/:note_id/cheer", type: :request do
  subject { delete(api_v1_note_cheer_path(note_id), headers:) }

  let(:user) { create(:user) }
  let(:note) { create(:note) }
  let(:note_id) { note.id }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    include_examples "リソース不在エラー", "ノート", "note_id"
    include_examples "ノート非公開エラー"

    context "ノートにエールしていない場合" do
      it "422エラーとエラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response["error"]).to eq("このノートにエールしていません")
      end
    end

    context "ステータスが公開中のノートに、すでにエールしている場合" do
      before { user.cheers.create!(note:) }

      it "エールを削除でき、200ステータスが返る" do
        subject
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
