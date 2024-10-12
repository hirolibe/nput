require "rails_helper"

RSpec.describe "Api::V1::Notes", type: :request do
  describe "GET /api/v1/notes" do
    subject { get(api_v1_notes_path(params)) }

    before do
      create_list(:note, 25, status: :published)
      create_list(:note, 8, status: :draft)
    end

    context "paramsにpageのクエリが含まれていない場合" do
      let(:params) { nil }

      it "200ステータス、1ページ目のレコード、ページ情報が返る" do
        subject
        expect(response).to have_http_status(:ok)
        expect(json_response.keys).to eq ["notes", "meta"]
        expect(json_response["notes"][0].keys).to eq ["id", "title", "author_name", "from_today", "user"]
        expect(json_response["notes"][0]["user"].keys).to eq ["name", "email"]
        expect(json_response["meta"].keys).to eq ["current_page", "total_pages"]
        expect(json_response["meta"]["current_page"]).to eq 1
      end
    end

    context "paramsに存在するpageのクエリを含む場合" do
      let(:params) { { page: 2 } }

      it "200ステータス、該当ページのレコード、ページ情報が返る" do
        subject
        expect(response).to have_http_status(:ok)
        expect(json_response.keys).to eq ["notes", "meta"]
        expect(json_response["notes"][0].keys).to eq ["id", "title", "author_name", "from_today", "user"]
        expect(json_response["notes"][0]["user"].keys).to eq ["name", "email"]
        expect(json_response["meta"].keys).to eq ["current_page", "total_pages"]
        expect(json_response["meta"]["current_page"]).to eq 2
      end
    end
  end

  describe "GET /api/v1/notes/:id" do
    subject { get(api_v1_note_path(note_id)) }

    let(:note) { create(:note, status:) }

    context "指定したidに対応するレコードが存在する場合" do
      let(:note_id) { note.id }

      context "指定したidのレコードのステータスが公開中の場合" do
        let(:status) { :published }

        it "200ステータスと指定したidのレコードが返る" do
          subject
          expect(response).to have_http_status(:ok)
          expect(json_response.keys).to eq ["id", "title", "content", "status_jp", "published_date", "updated_date", "author_name", "user"]
          expect(json_response["user"].keys).to eq ["name", "email"]
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
end
