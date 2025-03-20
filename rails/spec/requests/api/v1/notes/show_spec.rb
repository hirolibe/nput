require "rails_helper"

RSpec.describe "Api::V1::Notes GET /api/v1/:name/notes/:slug", type: :request do
  subject { get(api_v1_user_note_path(name, note_slug)) }

  let(:note) { create(:note) }
  let(:name) { note.user.name }
  let(:note_slug) { note.slug }

  include_examples "リソース不在エラー", "アカウント", "name"
  include_examples "リソース不在エラー", "ノート", "note_slug"
  include_examples "ノート非公開エラー"

  context "ステータスがアウトプットのノートが存在する場合" do
    before { create_list(:comment, 5, note:) }

    it "200ステータス、ノートの情報、コメントの情報が返る" do
      subject
      expect(response).to have_http_status(:ok)
      expect(json_response.keys).to eq EXPECTED_NOTE_KEYS
      expect(json_response["comments"][0].keys).to eq EXPECTED_COMMENT_KEYS
      expect(json_response["comments"][0]["user"].keys).to eq EXPECTED_BASIC_USER_KEYS
      expect(json_response["comments"][0]["user"]["profile"].keys).to eq EXPECTED_PROFILE_KEYS
      expect(json_response["user"].keys).to eq EXPECTED_BASIC_USER_KEYS
      expect(json_response["user"]["profile"].keys).to eq EXPECTED_PROFILE_KEYS
      expect(json_response["tags"][0].keys).to eq EXPECTED_TAG_KEYS
    end
  end
end
