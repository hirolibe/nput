require "rails_helper"

RSpec.describe "Api::V1::Comments", type: :request do
  describe "GET /api/v1/notes/:note_id/comments" do
    subject { get(api_v1_note_comments_path(note_id)) }

    let(:note) { create(:note) }
    let(:note_id) { note.id }

    before do
      create_list(:comment, 5, note:)
    end

    it "200ステータスとレコード情報が返る" do
      subject
      expect(response).to have_http_status(:ok)
      expect(json_response.length).to eq(5)
      expect(json_response[0].keys).to eq ["id", "content", "commenter_name", "from_today"]
    end
  end
end
