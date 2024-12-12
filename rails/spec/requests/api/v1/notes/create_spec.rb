require "rails_helper"

RSpec.describe "Api::V1::Notes POST /api/v1/:name/notes", type: :request do
  subject { post(api_v1_user_notes_path(name), headers:) }

  let(:headers) { { Authorization: "Bearer token" } }
  let(:user) { create(:user) }
  let(:name) { user.name }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    context "ログインユーザーに紐づく未保存ステータスのノートが0件の時" do
      it "未保存ステータスのノートが新規作成され、200ステータスとノートの情報が返る" do
        expect { subject }.to change { user.notes.count }.by(1)
        expect(response).to have_http_status(:ok)
        expect(user.notes.last).to be_unsaved
        expect(json_response.keys).to eq EXPECTED_NOTE_KEYS
      end
    end

    context "ログインユーザーに紐づく未保存ステータスのノートが1件の時" do
      before { create(:note, user:, status: :unsaved) }

      it "200ステータスと既存の未保存ステータスのノートの情報が返る" do
        expect { subject }.not_to change { user.notes.count }
        expect(response).to have_http_status(:ok)
        expect(json_response.keys).to eq EXPECTED_NOTE_KEYS
      end
    end
  end
end
