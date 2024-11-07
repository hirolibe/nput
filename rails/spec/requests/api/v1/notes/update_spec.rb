require "rails_helper"

RSpec.describe "Api::V1::Notes PATCH /api/v1/notes/id", type: :request do
  subject { patch(api_v1_note_path(note_id), headers:, params:) }

  let(:user) { create(:user) }
  let(:note) do
    create(
      :note,
      title: "タイトル",
      content: "本文",
      status: :draft,
      published_at: Date.new(2024, 10, 1),
      user:,
    )
  end
  let(:note_id) { note.id }
  let(:headers) { { Authorization: "Bearer token" } }
  let(:params) { "valid_params" }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    include_examples "リソース不在エラー", "ノート", "note_id"
    include_examples "アクセス権限エラー", "ノート", "note"

    context "ログインユーザーが作成したノートが存在する場合" do
      context "バリデーションに失敗した場合" do
        let(:params) {
          { "note": { "title": "", "status": "published" } }
        }

        include_examples "バリデーションエラーのレスポンス検証"
      end

      context "バリデーションに成功し、durationが含まれる場合" do
        let(:params) {
          {
            "note": {
              "title": "更新後のタイトル",
              "content": "更新後の本文",
              "status": "published",
              "published_at": "2024/11/1",
            },
            "duration": 300,
          }
        }

        it "ノートが更新され、デュレーションレコードが作成され、200ステータスとノートの情報が返る" do
          expect { subject }.to change { note.reload.title }.from("タイトル").to("更新後のタイトル") and
            change { note.reload.content }.from("本文").to("更新後の本文") and
            change { note.reload.status }.from("draft").to("published") and
            change { note.reload.published_at }.from("2024/10/1").to("2024/11/1") and
            change { user.cheer_points }.by(1)
          expect(Duration.last.duration).to eq(300)
          expect(Duration.last.note).to eq(note)
          expect(Duration.last.user).to eq(user)
          expect(response).to have_http_status(:ok)
          expect(json_response.keys).to eq ["note", "message"]
          expect(json_response["note"].keys).to eq EXPECTED_NOTE_KEYS
          expect(json_response["message"]).to eq("ノートを更新しました！")
        end
      end
    end
  end
end
