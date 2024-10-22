require "rails_helper"

RSpec.describe "Api::V1::Comments GET /api/v1/notes/:note_id/comments", type: :request do
  subject { get(api_v1_note_comments_path(note_id)) }

  let(:note) { create(:note) }
  let(:note_id) { note.id }

  before { create_list(:comment, 5, note:) }

  it "200ステータスとレコード情報が返る" do
    subject
    expect(response).to have_http_status(:ok)
    expect(json_response.length).to eq(5)
    expect(json_response[0].keys).to eq ["id", "content", "from_today", "user"]
    expect(json_response[0]["user"].keys).to eq ["id", "profile"]
    expect(json_response[0]["user"]["profile"].keys).to eq ["id", "nickname", "bio", "x_username", "github_username", "cheer_points", "avatar_url"]
  end
end
