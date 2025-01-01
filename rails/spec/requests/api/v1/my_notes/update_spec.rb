require "rails_helper"

RSpec.describe "Api::V1::MyNotes PATCH /api/v1/my_notes/slug", type: :request do
  subject { patch(api_v1_my_note_path(note_slug), headers:, params:) }

  let(:user) { create(:user, cheer_points: 360) }
  let(:note) { create(:note, user:) }
  let(:note_slug) { note.slug }
  let(:headers) { { Authorization: "Bearer token" } }
  let(:params) { "valid_params" }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    context  "ノートが存在しない場合" do
      let(:note_slug) { "non_exist_slug" }

      include_examples "404エラー", "ノート"
    end

    include_examples "アクセス権限エラー", "ノート", "note"

    context "ログインユーザーが作成したノートが存在する場合" do
      context "バリデーションに失敗した場合" do
        let(:params) {
          { "note": { "title": "" }, "duration": 1 }
        }

        include_examples "バリデーションエラーのレスポンス検証"
      end

      context "バリデーションに成功した場合" do
        let(:params) {
          {
            "note": {
              "title": "更新後のタイトル",
              "description": "更新後の概要",
              "content": "更新後の本文",
              "status": "draft",
            },
            "duration": 1,
            "tag_names": ["a", "b", "c", "d", "e"],
          }
        }

        it "ノート更新に伴う処理が実行され、200ステータスとノートの情報が返る" do
          initial_published_at = note.published_at
          initial_cheer_points = user.cheer_points

          subject
          expect(note.reload.title).to eq("更新後のタイトル")
          expect(note.reload.description).to eq("更新後の概要")
          expect(note.reload.content).to eq("更新後の本文")
          expect(note.reload.status).to eq("draft")
          expect(note.reload.published_at).to eq(initial_published_at)

          expect(response).to have_http_status(:ok)
          expect(user.reload.cheer_points).to eq(initial_cheer_points + 1)

          tag_names = note.reload.tags.map {|tag| tag["name"] }
          expect(tag_names).to contain_exactly("a", "b", "c", "d", "e")
        end
      end
    end
  end
end
