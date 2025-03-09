require "rails_helper"

RSpec.describe "Api::V1::Cheers GET /api/v1/:name/notes/:note_slug/cheer", type: :request do
  subject { get(api_v1_user_note_cheer_path(name, note_slug), headers:) }

  let(:current_user) { create(:user) }
  let(:user) { create(:user) }
  let(:name) { user.name }
  let(:note) { create(:note) }
  let(:note_slug) { note.slug }
  let(:headers) { { Authorization: "Bearer token" } }

  before { stub_token_verification.and_return({ "sub" => current_user.uid }) }

  context  "ノートが存在しない場合" do
    let(:note_slug) { "non_exist_slug" }

    include_examples "404エラー", "ノート"
  end

  context "ノートが存在する場合" do
    before { create(:cheer, note:, user: current_user) }

    it "200ステータス、エール状態が返る" do
      subject
      expect(response).to have_http_status(:ok)
      expect(json_response["has_cheered"]).to be true
    end
  end
end
