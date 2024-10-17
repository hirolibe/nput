require "rails_helper"

RSpec.describe "Api::V1::Notes PATCH /api/v1/notes/id", type: :request do
  subject { patch(api_v1_note_path(note_id), headers:, params:) }

  let(:current_user) { create(:user) }
  let(:note) { create(:note, title: "タイトル", content: "本文", status: :draft, published_at: 2024 / 10 / 1, user: current_user) }
  let(:note_id) { note.id }
  let(:headers) { { Authorization: "Bearer token" } }
  let(:params) { { "note": { "title": "更新タイトル", "content": "更新本文", "status": "published", "published_at": "2024/11/1" } } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before do
      stub_token_verification.and_return({ "sub" => current_user.uid })
    end

    context "ログインユーザーが作成したノートの場合" do
      it "正常にレコードを更新できる" do
        expect { subject }.to change { note.reload.title }.from("タイトル").to("更新タイトル") and
          change { note.reload.content }.from("本文").to("更新本文") and
          change { note.reload.status }.from("draft").to("published") and
          change { note.reload.published_at }.from("2024/10/1").to("2024/11/1")
        expect(json_response.keys).to eq ["id", "title", "content", "status_jp", "published_date", "updated_date", "author_name"]
        expect(response).to have_http_status(:ok)
      end
    end

    context "ログインユーザーが作成したノートではない場合" do
      let(:other_user) { create(:user) }
      let(:note) { create(:note, user: other_user) }

      it "例外が発生する" do
        expect { subject }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
