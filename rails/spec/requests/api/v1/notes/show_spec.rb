require "rails_helper"

RSpec.describe "Api::V1::Notes GET /api/v1/notes/:id", type: :request do
  subject { get(api_v1_note_path(note_id)) }

  context "指定したidに対応するレコードが存在する場合" do
    let(:note) { create(:note, status:) }
    let(:note_id) { note.id }

    context "指定したidのレコードのステータスが公開中の場合" do
      let(:status) { :published }

      it "200ステータスと指定したidのレコードが返る" do
        subject
        expect(response).to have_http_status(:ok)
        expect(json_response.keys).to eq ["id", "title", "content", "status_jp", "published_date", "updated_date", "user"]
        expect(json_response["user"].keys).to eq ["id", "display_name", "bio", "avatar_url", "sns_link_x", "sns_link_github", "cheer_points"]
      end
    end

    context "指定したidのレコードのステータスが下書きの場合" do
      let(:status) { :draft }

      it "404エラーとエラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:not_found)
        expect(json_response["error"]).to eq("ノートが見つかりません")
      end
    end
  end

  context "指定したidに対応するレコードが存在しない場合" do
    let(:note_id) { 10_000_000_000 }

    it "404エラーとエラーメッセージが返る" do
      subject
      expect(response).to have_http_status(:not_found)
      expect(json_response["error"]).to eq("ノートが見つかりません")
    end
  end
end
