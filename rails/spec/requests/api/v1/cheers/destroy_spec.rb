require "rails_helper"

RSpec.describe "Api::V1::Cheers DELETE /api/v1/:name/notes/:note_slug/cheer", type: :request do
  subject { delete(api_v1_user_note_cheer_path(name, note_slug), headers:) }

  let(:current_user) { create(:user) }
  let(:user) { create(:user) }
  let(:name) { user.name }
  let(:note) { create(:note, user:) }
  let(:note_slug) { note.slug }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => current_user.uid }) }

    context  "ノートが存在しない場合" do
      let(:note_slug) { "non_exist_slug" }

      include_examples "404エラー", "ノート"
    end

    include_examples "ノート非公開エラー"

    context "ノートにエールしていない場合" do
      it "422エラーとエラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response["error"]).to eq("このノートにエールしていません")
      end
    end

    context "ステータスがアウトプットのノートに、すでにエールしている場合" do
      before { current_user.cheers.create!(note:) }

      it "エールを削除でき、200ステータスが返る" do
        subject
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
