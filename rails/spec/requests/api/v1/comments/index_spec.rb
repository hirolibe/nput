require "rails_helper"

RSpec.describe "Api::V1::Comments GET /api/v1/notes/:note_id/comments", type: :request do
  subject { get(api_v1_note_comments_path(note_id)) }

  let(:note) { create(:note) }
  let(:note_id) { note.id }

  before { create_list(:comment, 5, note:) }

  include_examples "リソース不在エラー", "ノート", "note_id"

  context "ノートが存在する場合" do
    context "ノートのステータスが公開中の場合" do
      it "200ステータスとコメントの情報が返る" do
        subject
        expect(response).to have_http_status(:ok)
        expect(json_response.length).to eq(5)
        expect(json_response[0].keys).to eq ["id", "content", "from_today", "user"]
        expect(json_response[0]["user"].keys).to eq ["id", "profile"]
        expect(json_response[0]["user"]["profile"].keys).to eq ["id", "nickname", "bio", "x_username", "github_username", "cheer_points", "avatar_url"]
      end
    end

    context "ノートのステータスが下書きの場合" do
      let(:note) { create(:note, status: :draft) }

      include_examples "404エラー", "ノート"
    end
  end
end
