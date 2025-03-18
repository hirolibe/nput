require "rails_helper"

RSpec.describe "Api::V1::Files POST /api/v1/:name/folders/:folder_name/filed_notes/:filed_note_slug/file", type: :request do
  subject { post(api_v1_user_filed_note_file_path(name, folder_name, filed_note_slug), headers:) }

  let(:user) { create(:user) }
  let(:name) { user.name }
  let(:folder) { create(:folder, user:) }
  let(:folder_name) { folder.folder_name }
  let(:note) { create(:note, user:) }
  let(:filed_note_slug) { note.slug }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    context  "フォルダが存在しない場合" do
      let(:folder_name) { "non_exist_name" }

      include_examples "404エラー", "フォルダ"
    end

    context "ノートが存在しない場合" do
      let(:filed_note_slug) { "non_exist_slug" }

      include_examples "404エラー", "ノート"
    end

    context "フォルダ内に指定したノートがすでに存在する場合" do
      before { create(:note_folder, note:, folder:) }

      include_examples "バリデーションエラーのレスポンス検証"
    end

    context "フォルダ内に指定したノートが存在しない場合" do
      it "ノートをフォルダに保管し、201ステータスが返る" do
        expect { subject }.to change { folder.notes.count }.by(1)
        expect(response).to have_http_status(:created)
      end
    end
  end
end
