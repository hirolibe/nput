require "rails_helper"

RSpec.describe "Api::V1::Notes GET /api/v1/notes/:id", type: :request do
  subject { get(api_v1_note_path(note_id)) }

  let(:note) { create(:note) }
  let(:note_id) { note.id }

  include_examples "リソース不在エラー", "ノート", "note_id"
  include_examples "ノート非公開エラー"

  context "ステータスが公開中のノートが存在する場合" do
    it "200ステータスとノートの情報が返る" do
      subject
      expect(response).to have_http_status(:ok)
      expect(json_response.keys).to eq ["id", "title", "content", "status_jp", "published_date", "updated_date", "user"]
      expect(json_response["user"].keys).to eq ["id", "profile"]
      expect(json_response["user"]["profile"].keys).to eq ["id", "nickname", "bio", "x_username", "github_username", "cheer_points", "avatar_url"]
    end
  end
end
