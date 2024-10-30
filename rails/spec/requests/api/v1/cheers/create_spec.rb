require "rails_helper"

RSpec.describe "Api::V1::Cheers POST /api/v1/notes/:note_id/cheer", type: :request do
  subject { post(api_v1_note_cheer_path(note_id), headers:) }

  let(:headers) { { Authorization: "Bearer token" } }
  let(:user) { create(:user) }
  let(:note) { create(:note) }
  let(:note_id) { note.id }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    include_examples "リソース不在エラー", "ノート", "note_id"
    include_examples "ノート非公開エラー"

    context "保有エールポイントが0の場合" do
      before do
        user.profile.cheer_points = 0
        user.profile.save!
      end

      it "422エラーとエラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response["error"]).to eq("保有エールポイントが不足しています")
      end
    end

    context "ステータスが公開中のノートが存在し、保有ポイントが1以上10以下の場合" do
      before do
        user.profile.cheer_points = Faker::Number.between(from: 1, to: 10)
        user.profile.save!
      end

      context "すでにノートにエールしている状態の場合" do
        before { user.cheers.create!(note_id:) }

        it "422エラーとエラーメッセージが返る" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
          expect(json_response["error"]).to eq("すでにこのノートにエールしています")
        end
      end

      context "ノートにエールしていない状態の場合" do
        it "エールが新規作成され、保有エールポイントが1減り、201ステータスとエール状態の情報が返る" do
          expect { subject }.to change { note.cheers.count }.by(1) and
            change { user.profile.cheer_points }.by(-1)
          expect(response).to have_http_status(:created)
          expect(json_response["cheer_status"]).to be true
        end
      end
    end
  end
end
