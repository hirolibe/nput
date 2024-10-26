require "rails_helper"

RSpec.describe "Api::V1::Comments POST /api/v1/notes/:note_id/comments", type: :request do
  subject { post(api_v1_note_comments_path(note_id), headers:, params:) }

  let(:headers) { { Authorization: "Bearer token" } }
  let(:params) { { comment: { content: Faker::Lorem.sentence } } }
  let(:user) { create(:user) }
  let(:note) { create(:note) }
  let(:note_id) { note.id }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    include_examples "リソース不在エラー", "ノート", "note_id"
    include_examples "ノート非公開エラー"

    context "ステータスが公開中のノートが存在する場合" do
      it "コメントが新規作成され、201ステータスが返る" do
        expect { subject }.to change { note.comments.count }.by(1)
        expect(response).to have_http_status(:created)
        expect(json_response["message"]).to eq("コメントを追加しました！")
      end
    end
  end
end
