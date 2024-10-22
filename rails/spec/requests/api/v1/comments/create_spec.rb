require "rails_helper"

RSpec.describe "Api::V1::Comments POST /api/v1/notes/:note_id/comments", type: :request do
  subject { post(api_v1_note_comments_path(note_id), headers:, params:) }

  let(:headers) { { Authorization: "Bearer token" } }
  let(:params) { { comment: { content: Faker::Lorem.sentence } } }
  let(:current_user) { create(:user) }
  let(:note) { create(:note) }
  let(:note_id) { note.id }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => current_user.uid }) }

    context "ノートが存在する場合" do
      context "全てのパラメータを正しく入力した場合" do
        it "コメントが新規作成され、201ステータスが返る" do
          expect { subject }.to change { note.comments.count }.by(1)
          expect(response).to have_http_status(:created)
          expect(json_response["message"]).to eq("コメントを追加しました！")
        end
      end

      context "コメントが空の場合" do
        let(:params) { { comment: { content: "" } } }

        it "422ステータスとエラーメッセージが返る" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
          expect(json_response["errors"]).to eq ["コメントを入力してください"]
        end
      end

      context "ノートのステータスが下書きの場合" do
        let(:note) { create(:note, status: :draft) }

        it "404エラーとエラーメッセージが返る" do
          subject
          expect(response).to have_http_status(:not_found)
          expect(json_response["error"]).to eq("ノートが見つかりません")
        end
      end
    end

    context "ノートが存在しない場合" do
      let(:note_id) { 10_000_000_000 }

      it "404エラーとエラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:not_found)
        expect(json_response["error"]).to eq("ノートが見つかりません")
      end
    end
  end
end
