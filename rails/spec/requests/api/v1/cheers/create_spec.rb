require "rails_helper"

RSpec.describe "Api::V1::Cheers POST /api/v1/:name/notes/:note_slug/cheer", type: :request do
  subject { post(api_v1_user_note_cheer_path(name, note_slug), headers:) }

  let(:current_user) { create(:user) }
  let(:user) { create(:user) }
  let(:name) { user.name }
  let(:note) { create(:note, user:) }
  let(:note_slug) { note.slug }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => current_user.uid }) }

    context "保有エールポイントが360ポイント未満の場合" do
      before { current_user.update!(cheer_points: rand(0..359)) }

      it "422エラーとエラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response["error"]).to eq("保有エールポイントが不足しています")
      end
    end

    context "保有エールポイントが360ポイント以上の場合" do
      before do
        current_user.update!(cheer_points: rand(360..3600))
        create(:note, user:)
      end

      context "ノートが存在しない場合" do
        let(:note_slug) { "non_exist_slug" }

        include_examples "404エラー", "ノート"
      end

      include_examples "ノート非公開エラー"

      context "ステータスが公開中のノートに、すでにエールしている場合" do
        before { current_user.cheers.create!(note:) }

        include_examples "バリデーションエラーのレスポンス検証"
      end

      context "ステータスが公開中のノートにエールしていない場合" do
        it "ノートにエールし、保有エールポイントが360ポイント減り、201ステータスが返る" do
          expect { subject }.to change { note.cheers.count }.by(1).
                                  and change { current_user.reload.cheer_points }.by(-360)
          expect(response).to have_http_status(:created)
        end
      end
    end
  end
end
