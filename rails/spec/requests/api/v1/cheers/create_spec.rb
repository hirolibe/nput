require "rails_helper"

RSpec.describe "Api::V1::Cheers POST /api/v1/notes/:note_id/cheer", type: :request do
  subject { post(api_v1_note_cheer_path(note_id), headers:) }

  let(:headers) { { Authorization: "Bearer token" } }
  let(:user) { create(:user) }
  let(:note) { create(:note) }
  let(:note_id) { note.id }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    context "保有エールポイントが0の場合" do
      before { user.profile.update!(cheer_points: 0) }

      it "422エラーとエラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response["error"]).to eq("保有エールポイントが不足しています")
      end
    end

    context "保有エールポイントが1の場合" do
      before { user.profile.update!(cheer_points: 1) }

      include_examples "リソース不在エラー", "ノート", "note_id"
      include_examples "ノート非公開エラー"

      context "ステータスが公開中のノートに、すでにエールしている状態の場合" do
        before { user.cheers.create!(note_id:) }

        include_examples "バリデーションエラーのレスポンス検証"
      end

      context "ステータスが公開中のノートに、まだエールしていない状態の場合" do
        it "ノートにエールし、保有エールポイントが1減り、201ステータスとエール状態の情報が返る" do
          expect { subject }.to change { note.cheers.count }.by(1) and
            change { user.profile.cheer_points }.by(-1)
          expect(response).to have_http_status(:created)
        end
      end
    end
  end
end
