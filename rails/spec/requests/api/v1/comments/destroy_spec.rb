require "rails_helper"

RSpec.describe "Api::V1::Comments DELETE /api/v1/notes/:note_id/comments/:id", type: :request do
  subject { delete(api_v1_note_comment_path(note_id, comment_id), headers:) }

  let(:current_user) { create(:user) }
  let(:note) { create(:note) }
  let(:note_id) { note.id }
  let(:comment) { create(:comment, note:, user: current_user) }
  let(:comment_id) { comment.id }
  let(:headers) { { Authorization: "Bearer token" } }

  before do
    stub_token_verification.and_return({ "sub" => current_user.uid })
  end

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    context "コメントが存在する場合" do
      context "ログインユーザーが作成したコメントの場合" do
        it "正常にレコードを削除でき、204ステータスが返る" do
          subject
          expect(response).to have_http_status(:ok)
          expect(json_response["message"]).to eq("コメントが削除されました")
        end
      end

      context "ログインユーザーが作成したコメントではない場合" do
        let(:other_user) { create(:user) }
        let(:comment) { create(:comment, note:, user: other_user) }

        it "404エラーとエラーメッセージが返る" do
          subject
          expect(response).to have_http_status(:not_found)
          expect(json_response["error"]).to eq("コメントが見つかりません")
        end
      end
    end

    context "コメントが存在しない場合" do
      let(:comment_id) { 10_000_000_000 }

      it "404エラーとエラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:not_found)
        expect(json_response["error"]).to eq("コメントが見つかりません")
      end
    end
  end
end
