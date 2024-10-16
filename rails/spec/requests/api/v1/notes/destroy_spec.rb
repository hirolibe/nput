require "rails_helper"

RSpec.describe "Api::V1::Notes DELETE /api/v1/notes/:id", type: :request do
  subject { delete(api_v1_note_path(note_id), headers:) }

  let(:current_user) { create(:user) }
  let(:note) { create(:note, user: current_user) }
  let(:note_id) { note.id }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    context "ログインユーザーが作成したノートの場合" do
      before do
        stub_token_verification.and_return({ "sub" => current_user.uid })
      end

      it "正常にレコードを削除でき、204ステータスが返る" do
        subject
        expect(response).to have_http_status(:no_content)
      end
    end

    context "ログインユーザーが作成したノートではない場合" do
      let(:other_user) { create(:user) }
      let(:note) { create(:note, user: other_user) }

      before do
        stub_token_verification.and_return({ "sub" => current_user.uid })
      end

      it "例外が発生する" do
        expect { subject }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
