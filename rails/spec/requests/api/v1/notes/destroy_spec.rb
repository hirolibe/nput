require "rails_helper"

RSpec.describe "Api::V1::Notes DELETE /api/v1/notes/:id", type: :request do
  subject { delete(api_v1_note_path(note_id), headers:) }

  let(:current_user) { create(:user) }
  let(:note) { create(:note, user: current_user) }
  let(:note_id) { note.id }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => current_user.uid }) }

    context "ログインユーザーが作成したノートの場合" do
      it "正常にノートを削除でき、200ステータスとメッセージが返る" do
        subject
        expect(response).to have_http_status(:ok)
        expect(json_response["message"]).to eq("ノートを削除しました")
      end
    end

    context "ログインユーザーが作成したノートではない場合" do
      let(:other_user) { create(:user) }
      let(:note) { create(:note, user: other_user) }

      it "404エラーとエラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:not_found)
        expect(json_response["error"]).to eq("ノートが見つかりません")
      end
    end
  end
end
