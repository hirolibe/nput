require "rails_helper"

RSpec.describe "Api::V1::Notes GET /api/v1/notes/:id", type: :request do
  subject { get(api_v1_note_path(note_id)) }

  let(:note) { create(:note) }
  let(:note_id) { note.id }

  include_examples "リソース不在エラー", "ノート", "note_id"

  context "ノートが存在する場合" do
    context "ノートのステータスが公開中の場合" do
      it "200ステータスとノートの情報が返る" do
        subject
        expect(response).to have_http_status(:ok)
        expect(json_response.keys).to eq ["id", "title", "content", "status_jp", "published_date", "updated_date", "user"]
        expect(json_response["user"].keys).to eq ["id", "profile"]
        expect(json_response["user"]["profile"].keys).to eq ["id", "nickname", "bio", "x_username", "github_username", "cheer_points", "avatar_url"]
      end
    end

    context "ノートのステータスが下書きの場合" do
      let(:note) { create(:note, status: :draft) }

      include_examples "404エラー", "ノート"
    end
  end
end
