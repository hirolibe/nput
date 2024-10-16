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
        expect(json_response.keys).to eq ["id", "title", "content", "status_jp", "published_date", "updated_date", "author_name"]
      end
    end

    context "指定したidのレコードのステータスが下書きの場合" do
      let(:status) { :draft }

      it "ActiveRecord::RecordNotFound エラーが返る" do
        expect { subject }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  context "指定したidに対応するレコードが存在しない場合" do
    let(:note_id) { 10_000_000_000 }

    it "ActiveRecord::RecordNotFound エラーが返る" do
      expect { subject }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end
end
