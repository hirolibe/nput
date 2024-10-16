require "rails_helper"

RSpec.describe "Api::V1::Notes POST /api/v1/notes", type: :request do
  subject { post(api_v1_notes_path, headers:) }

  let(:headers) { { Authorization: "Bearer token" } }
  let(:current_user) { create(:user) }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before do
      stub_token_verification.and_return({ "sub" => current_user.uid })
    end

    context "ログインユーザーに紐づく未保存ステータスの記事が0件の時" do
      it "未保存ステータスの記事が新規作成される" do
        expect { subject }.to change { current_user.notes.count }.by(1)
        expect(response).to have_http_status(:ok)
        expect(current_user.notes.last).to be_unsaved
        expect(json_response.keys).to eq ["id", "title", "content", "status_jp", "published_date", "updated_date", "author_name"]
      end
    end

    context "ログインユーザーに紐づく未保存ステータスの記事が1件の時" do
      before { create(:note, user: current_user, status: :unsaved) }

      it "既存の未保存ステータスの記事が表示される" do
        expect { subject }.not_to change { current_user.notes.count }
        expect(response).to have_http_status(:ok)
        expect(json_response.keys).to eq ["id", "title", "content", "status_jp", "published_date", "updated_date", "author_name"]
      end
    end
  end
end
