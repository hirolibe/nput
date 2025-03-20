require "rails_helper"

RSpec.describe "Api::V1::Files GET /api/v1/my_folders/:folder_slug/my_filed_notes/:note_slug/file", type: :request do
  subject { get(api_v1_file_path(folder_slug, note_slug), headers:) }

  let(:user) { create(:user) }
  let(:name) { user.name }
  let(:folder) { create(:folder, user:) }
  let(:folder_slug) { folder.slug }
  let(:note) { create(:note, user:) }
  let(:note_slug) { note.slug }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    context  "フォルダが存在しない場合" do
      let(:folder_slug) { "non_exist_slug" }

      include_examples "404エラー", "フォルダ"
    end

    context "ノートが存在しない場合" do
      let(:note_slug) { "non_exist_slug" }

      include_examples "404エラー", "ノート"
    end

    context "フォルダとノートが存在する場合" do
      before { create(:note_folder, note:, folder:) }

      it "200ステータス、フォルダ内のノート有無に関する情報が返る" do
        subject
        expect(response).to have_http_status(:ok)
        expect(json_response["is_filed"]).to be true
      end
    end
  end
end
