require "rails_helper"

RSpec.describe "Api::V1::Cheers POST /api/v1/:name/notes/:note_id/cheer", type: :request do
  subject { post(api_v1_user_note_cheer_path(name, note_id), headers:) }

  let(:user) { create(:user) }
  let(:name) { user.name }
  let(:note) { create(:note) }
  let(:note_id) { note.id }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    context "保有エールポイントが5ポイント未満の場合" do
      before { user.update!(cheer_points: rand(0..4)) }

      it "422エラーとエラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response["error"]).to eq("保有エールポイントが不足しています")
      end
    end

    context "保有エールポイントが5ポイント以上の場合" do
      before { user.update!(cheer_points: rand(5..50)) }

      include_examples "リソース不在エラー", "ノート", "note_id"
      include_examples "ノート非公開エラー"

      context "ステータスが公開中のノートに、すでにエールしている場合" do
        before { user.cheers.create!(note:) }

        include_examples "バリデーションエラーのレスポンス検証"
      end

      context "ステータスが公開中のノートにエールしていない場合" do
        it "ノートにエールし、保有エールポイントが5ポイント減り、201ステータスが返る" do
          expect { subject }.to change { note.cheers.count }.by(1).
                                  and change { user.reload.cheer_points }.by(-5)
          expect(response).to have_http_status(:created)
        end
      end
    end
  end
end
