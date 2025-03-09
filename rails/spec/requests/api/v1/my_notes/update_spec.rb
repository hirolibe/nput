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
          { note: { title: "" }, duration: 1 }
        }

        include_examples "バリデーションエラーのレスポンス検証"
      end

      context "バリデーションに成功した場合" do
        let(:image_signed_ids) { [create(:blob).signed_id, create(:blob).signed_id] }
        let(:params) {
          {
            note: {
              title: "更新後のタイトル",
              description: "更新後の概要",
              content: "更新後の本文",
              status: "draft",
            },
            duration: 1,
            tag_names: ["a", "b", "c", "d", "e"],
            image_signed_ids:,
          }
        }

        it "ノートが更新され、200ステータスとメッセージが返る" do
          initial_published_at = note.published_at

          subject
          expect(note.reload).to have_attributes(
            title: "更新後のタイトル",
            description: "更新後の概要",
            content: "更新後の本文",
            status: "draft",
            published_at: initial_published_at,
          )
          expect(response).to have_http_status(:ok)
          expect(json_response["message"]).to eq("ノートを更新しました！")
        end

        it "画像が2枚追加される" do
          expect { subject }.to change { note.reload.images.count }.by(2)
        end

        it "エールポイントが1増加する" do
          expect { subject }.to change { user.reload.cheer_points }.by(1)
        end

        it "タグが更新される" do
          subject
          tag_names = note.reload.tags.map {|tag| tag["name"] }
          expect(tag_names).to contain_exactly("a", "b", "c", "d", "e")
        end
      end
    end
  end
end
