require "rails_helper"

RSpec.describe "Api::V1::Notes PATCH /api/v1/notes/id", type: :request do
  subject { patch(api_v1_note_path(note_id), headers:, params:) }

  let(:current_user) { create(:user) }
  let(:note) { create(:note, title: "タイトル", content: "本文", status: :draft, published_at: 2024 / 10 / 1, user: current_user) }
  let(:note_id) { note.id }
  let(:headers) { { Authorization: "Bearer token" } }
  let(:params) { { "note": { "title": "更新後のタイトル", "content": "更新後の本文", "status": "published", "published_at": "2024/11/1" } } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => current_user.uid }) }

    context "ログインユーザーが作成したノートの場合" do
      context "全てのパラメータを正しく入力した場合" do
        it "正常にノートを更新できる" do
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

      context "ステータスが公開中かつタイトルが空の場合" do
        let(:params) { { "note": { "title": "", "content": "更新後の本文", "status": "published", "published_at": "2024/11/1" } } }

        it "422ステータスとエラーメッセージが返る" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
          expect(json_response["errors"]).to eq ["タイトルを入力してください"]
        end
      end

      context "ステータスが公開中かつ本文が空の場合" do
        let(:params) { { "note": { "title": "更新後のタイトル", "content": "", "status": "published", "published_at": "2024/11/1" } } }

        it "422ステータスとエラーメッセージが返る" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
          expect(json_response["errors"]).to eq ["本文を入力してください"]
        end
      end
    end

    context "ログインユーザーが作成したノートではない場合" do
      let(:other_user) { create(:user) }
      let(:note) { create(:note, user: other_user) }

      it "404エラーとエラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:not_found)
        expect(json_response["error"]).to eq("ノートが見つかりません")
      end
    end
  end
end
