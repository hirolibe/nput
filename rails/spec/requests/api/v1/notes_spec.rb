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

  describe "POST api/v1/notes" do
    subject { post(api_v1_notes_path, headers:) }

    let(:headers) { { Authorization: "Bearer token" } }
    let(:current_user) { create(:user) }

    context "トークンが欠落している場合" do
      include_examples "トークン欠落エラー"
    end

    context "トークンの有効期限が切れている場合" do
      include_examples "トークン期限切れエラー"
    end

    context "無効なトークンを受け取り、ユーザー情報を取得できなかった場合" do
      include_examples "トークン無効エラー"
    end

    context "有効なトークンを受け取ったが、データベースにアカウントが存在しなかった場合" do
      include_examples "アカウントエラー"
    end

    context "ログインユーザーに紐づく未保存ステータスの記事が0件の時" do
      before do
        stub_token_verification.and_return({ "sub" => current_user.uid })
      end

      it "未保存ステータスの記事が新規作成される" do
        expect { subject }.to change { current_user.notes.count }.by(1)
        expect(response).to have_http_status(:ok)
        expect(current_user.notes.last).to be_unsaved
        expect(json_response.keys).to eq ["id", "title", "content", "status_jp", "published_date", "updated_date", "author_name", "user"]
        expect(json_response["user"].keys).to eq ["name", "email"]
      end
    end

    context "ログインユーザーに紐づく未保存ステータスの記事が1件の時" do
      before do
        create(:note, user: current_user, status: :unsaved)
        stub_token_verification.and_return({ "sub" => current_user.uid })
      end

      it "既存の未保存ステータスの記事が表示される" do
        expect { subject }.not_to change { current_user.notes.count }
        expect(response).to have_http_status(:ok)
        expect(json_response.keys).to eq ["id", "title", "content", "status_jp", "published_date", "updated_date", "author_name", "user"]
        expect(json_response["user"].keys).to eq ["name", "email"]
      end
    end
  end

  describe "PATCH api/v1/notes/id" do
    subject { patch(api_v1_note_path(note_id), headers:, params:) }

    let(:current_user) { create(:user) }
    let(:current_user_note) { create(:note, title: "タイトル", content: "本文", status: :draft, published_at: 2024 / 10 / 1, user: current_user) }
    let(:note_id) { current_user_note.id }
    let(:headers) { { Authorization: "Bearer token" } }
    let(:params) { { "note": { "title": "更新タイトル", "content": "更新本文", "status": "published", "published_at": "2024/11/1" } } }

    context "トークンが欠落している場合" do
      include_examples "トークン欠落エラー"
    end

    context "トークンの有効期限が切れている場合" do
      include_examples "トークン期限切れエラー"
    end

    context "無効なトークンを受け取り、ユーザー情報を取得できなかった場合" do
      include_examples "トークン無効エラー"
    end

    context "有効なトークンを受け取ったが、データベースにアカウントが存在しなかった場合" do
      include_examples "アカウントエラー"
    end

    context "更新するノートのidが、ログインユーザーが作成したノートのidである場合" do
      before do
        stub_token_verification.and_return({ "sub" => current_user.uid })
      end

      it "正常にレコードを更新できる" do
        expect { subject }.to change { current_user_note.reload.title }.from("タイトル").to("更新タイトル") and
          change { current_user_note.reload.content }.from("本文").to("更新本文") and
          change { current_user_note.reload.status }.from("draft").to("published") and
          change { current_user_note.reload.published_at }.from("2024/10/1").to("2024/11/1")
        expect(json_response.keys).to eq ["id", "title", "content", "status_jp", "published_date", "updated_date", "author_name", "user"]
        expect(json_response["user"].keys).to eq ["name", "email"]
        expect(response).to have_http_status(:ok)
      end
    end

    context "更新するノートのidが、ログインユーザーが作成したノートのidではない場合" do
      let(:other_user) { create(:user) }
      let(:other_user_note) { create(:note, user: other_user) }
      let(:note_id) { other_user_note.id }

      before do
        stub_token_verification.and_return({ "sub" => current_user.uid })
      end

      it "例外が発生する" do
        expect { subject }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  describe "DELETE api/v1/notes/id" do
    subject { delete(api_v1_note_path(note_id), headers:) }

    let(:current_user) { create(:user) }
    let(:current_user_note) { create(:note, user: current_user) }
    let(:note_id) { current_user_note.id }
    let(:headers) { { Authorization: "Bearer token" } }

    context "トークンが欠落している場合" do
      include_examples "トークン欠落エラー"
    end

    context "トークンの有効期限が切れている場合" do
      include_examples "トークン期限切れエラー"
    end

    context "無効なトークンを受け取り、ユーザー情報を取得できなかった場合" do
      include_examples "トークン無効エラー"
    end

    context "有効なトークンを受け取ったが、データベースにアカウントが存在しなかった場合" do
      include_examples "アカウントエラー"
    end

    context "削除するノートのidが、ログインユーザーが作成したノートのidである場合" do
      before do
        stub_token_verification.and_return({ "sub" => current_user.uid })
      end

      it "正常にレコードを削除でき、204ステータスが返る" do
        subject
        expect(response).to have_http_status(:no_content)
      end
    end

    context "削除するノートのidが、ログインユーザーが作成したノートのidではない場合" do
      let(:other_user) { create(:user) }
      let(:other_user_note) { create(:note, user: other_user) }
      let(:note_id) { other_user_note.id }

      before do
        stub_token_verification.and_return({ "sub" => current_user.uid })
      end

      it "例外が発生する" do
        expect { subject }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
