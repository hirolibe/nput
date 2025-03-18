require "rails_helper"

RSpec.describe "Api::V1::Files DELETE /api/v1/:name/folders/:folder_name/filed_notes/:filed_note_slug/file", type: :request do
  subject { delete(api_v1_user_filed_note_file_path(name, folder_name, filed_note_slug), headers:) }

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

    context "フォルダ内に指定したノートが存在しない場合" do
      it "422エラーとエラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response["error"]).to eq("このノートはフォルダ内にありません")
      end
    end

    context "フォルダ内に指定したノートがすでに存在する場合" do
      before { create(:note_folder, note:, folder:) }

      it "ノートをフォルダから取り出すことができ、200ステータスが返る" do
        subject
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
