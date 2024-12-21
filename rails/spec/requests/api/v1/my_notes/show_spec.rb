require "rails_helper"

RSpec.describe "Api::V1::Notes GET /api/v1/my_notes/:id", type: :request do
  subject { get(api_v1_my_note_path(note_id), headers:) }

  let(:user) { create(:user) }
  let(:note) { create(:note, user:) }
  let(:note_id) { note.id }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before do
      stub_token_verification.and_return({ "sub" => user.uid })
    end

    include_examples "リソース不在エラー", "ノート", "note_id"

    context "ステータスが公開中のノートが存在する場合" do
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
end
