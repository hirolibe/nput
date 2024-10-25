require "rails_helper"

RSpec.describe "Api::V1::Notes PATCH /api/v1/notes/id", type: :request do
  subject { patch(api_v1_note_path(note_id), headers:, params:) }

  let(:user) { create(:user) }
  let(:note) { create(:note, title: "タイトル", content: "本文", status: :draft, published_at: 2024 / 10 / 1, user:) }
  let(:note_id) { note.id }
  let(:headers) { { Authorization: "Bearer token" } }
  let(:params) {
    {
      "note": {
        "title": "更新後のタイトル",
        "content": "更新後の本文",
        "status": "published",
        "published_at": "2024/11/1",
      },
    }
  }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    include_examples "ノートアクセスエラー"

    context "ログインユーザーが作成したノートが存在する場合" do
      it "ノートが更新され、200ステータスが返る" do
        expect { subject }.to change { note.reload.title }.from("タイトル").to("更新後のタイトル") and
          change { note.reload.content }.from("本文").to("更新後の本文") and
          change { note.reload.status }.from("draft").to("published") and
          change { note.reload.published_at }.from("2024/10/1").to("2024/11/1")
        expect(response).to have_http_status(:ok)
        expect(json_response.keys).to eq ["note", "message"]
        expect(json_response["note"].keys).to eq ["id", "title", "content", "status_jp", "published_date", "updated_date", "user"]
        expect(json_response["message"]).to eq("ノートを更新しました！")
      end
    end
  end
end
