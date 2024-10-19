require "rails_helper"

RSpec.describe "Api::V1::Notes POST /api/v1/notes", type: :request do
  subject { post(api_v1_notes_path, headers:) }

  let(:headers) { { Authorization: "Bearer token" } }
  let(:current_user) { create(:user) }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => current_user.uid }) }

    context "ログインユーザーに紐づく未保存ステータスのノートが0件の時" do
      it "未保存ステータスのノートが新規作成される" do
        expect { subject }.to change { current_user.notes.count }.by(1)
        expect(response).to have_http_status(:ok)
        expect(current_user.notes.last).to be_unsaved
        expect(json_response.keys).to eq ["id", "title", "content", "status_jp", "published_date", "updated_date", "user"]
        expect(json_response["user"].keys).to eq ["id", "display_name", "bio", "avatar_url", "sns_link_x", "sns_link_github", "cheer_points"]
      end
    end

    context "ログインユーザーに紐づく未保存ステータスのノートが1件の時" do
      before { create(:note, user: current_user, status: :unsaved) }

      it "既存の未保存ステータスのノートが返る" do
        expect { subject }.not_to change { current_user.notes.count }
        expect(response).to have_http_status(:ok)
        expect(json_response.keys).to eq ["id", "title", "content", "status_jp", "published_date", "updated_date", "user"]
        expect(json_response["user"].keys).to eq ["id", "display_name", "bio", "avatar_url", "sns_link_x", "sns_link_github", "cheer_points"]
      end
    end
  end
end
