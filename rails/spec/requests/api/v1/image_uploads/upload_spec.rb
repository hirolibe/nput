require "rails_helper"

RSpec.describe "Api::V1::ImageUploads POST /api/v1/image_uploads/upload", type: :request do
  subject { post(upload_api_v1_image_uploads_path, headers:, params:) }

  let(:user) { create(:user) }
  let(:headers) { { Authorization: "Bearer token" } }
  let(:params) { { image: valid_image_file } }
  let(:valid_image_file) { fixture_file_upload(Rails.root.join("spec/fixtures/files/valid_image.jpg"), "image/jpeg") }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before do
      stub_token_verification.and_return({ "sub" => user.uid })
    end

    context "画像が無効な場合" do
      let(:params) { { image: invalid_image_file } }
      let(:invalid_image_file) { fixture_file_upload(Rails.root.join("spec/fixtures/files/invalid_file.txt"), "text/plain") }

      it "422エラーとエラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response["error"]).to eq("画像のアップロードに失敗しました")
      end
    end

    context "画像が有効な場合" do
      it "画像がアップロードされ、201ステータスとsigned_idを返す" do
        subject
        expect(response).to have_http_status(:created)
        expect(json_response.keys).to eq ["signed_id"]
      end
    end
  end
end
