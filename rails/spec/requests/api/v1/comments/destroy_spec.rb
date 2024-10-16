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
    context "ログインユーザーが作成したコメントの場合" do
      it "正常にレコードを削除でき、204ステータスが返る" do
        subject
        expect(response).to have_http_status(:no_content)
      end
    end

    context "ログインユーザーが作成したコメントではない場合" do
      let(:other_user) { create(:user) }
      let(:comment) { create(:comment, note:, user: other_user) }

      it "例外が発生する" do
        expect { subject }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
