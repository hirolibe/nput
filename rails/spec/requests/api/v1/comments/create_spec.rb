require "rails_helper"

RSpec.describe "Api::V1::Comments POST /api/v1/:name/notes/:note_slug/comments", type: :request do
  subject { post(api_v1_user_note_comments_path(name, note_slug), headers:, params:) }

  let(:current_user) { create(:user) }
  let(:note) { create(:note, user: create(:user)) }
  let(:name) { note.user.name }
  let(:note_slug) { note.slug }

  let(:headers) { { Authorization: "Bearer token" } }
  let(:params) { { comment: { content: Faker::Lorem.sentence } } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => current_user.uid }) }

    context  "ノートが存在しない場合" do
      let(:note_slug) { "non_exist_slug" }

      include_examples "404エラー", "ノート"
    end

    include_examples "ノート非公開エラー"

    context "ステータスがアウトプットのノートが存在する場合" do
      context "バリデーションに失敗した場合" do
        let(:params) { { comment: { content: "" } } }

        include_examples "バリデーションエラーのレスポンス検証"
      end

      context "バリデーションに成功した場合" do
        let(:image_signed_ids) { [create(:blob).signed_id, create(:blob).signed_id] }
        let(:params) {
          {
            comment: { content: Faker::Lorem.sentence },
            image_signed_ids:,
          }
        }

        it "コメントが新規作成され、201ステータスとコメントの情報が返る" do
          expect { subject }.to change { note.comments.count }.by(1)
          expect(response).to have_http_status(:created)
          expect(json_response.keys).to eq EXPECTED_COMMENT_KEYS
        end

        it "画像が2枚追加される" do
          subject
          created_comment = Comment.last
          expect(created_comment.images.count).to eq(2)
        end
      end
    end
  end
end
