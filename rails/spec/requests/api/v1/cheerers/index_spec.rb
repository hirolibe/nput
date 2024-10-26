require "rails_helper"

RSpec.describe "Api::V1::Cheerers GET /api/v1/notes/:note_id/cheerers", type: :request do
  subject { get(api_v1_note_cheerers_path(note_id)) }

  let(:note) { create(:note) }
  let(:note_id) { note.id }

  before { create_list(:cheer, 10, note:) }

  include_examples "リソース不在エラー", "ノート", "note_id"
  include_examples "ノート非公開エラー"

  context "ステータスが公開中のノートが存在する場合" do
    it "200ステータスとユーザーの情報が返る" do
      subject
      expect(response).to have_http_status(:ok)
      expect(json_response[0].keys).to eq ["id", "profile"]
      expect(json_response[0]["profile"].keys).to eq ["id", "nickname", "bio", "x_username", "github_username", "cheer_points", "avatar_url"]
    end
  end
end
