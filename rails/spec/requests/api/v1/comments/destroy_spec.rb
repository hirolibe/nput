require "rails_helper"

RSpec.describe "Api::V1::Comments DELETE /api/v1/notes/:note_id/comments/:id", type: :request do
  subject { delete(api_v1_note_comment_path(note_id, comment_id), headers:) }

  let(:user) { create(:user) }
  let(:comment) { create(:comment, user:) }
  let(:note_id) { comment.note_id }
  let(:comment_id) { comment.id }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    include_examples "コメントアクセスエラー"

    include_examples "リソースの削除成功", "コメント"
  end
end
