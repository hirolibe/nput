require "rails_helper"

RSpec.describe "Api::V1::ImageUploads POST /api/v1/image_uploads/attach_avatar", type: :request do
  subject { post(attach_avatar_api_v1_image_uploads_path, headers:, params:) }

  let(:user) { create(:user) }
  let(:profile) { user.profile }
  let(:headers) { { Authorization: "Bearer token" } }
  let(:params) { { image_signed_id: } }
  let(:image_signed_id) { blob.signed_id }
  let(:blob) { create(:blob) }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before do
      stub_token_verification.and_return({ "sub" => user.uid })
    end

    context "signed_idが存在しない場合" do
      let(:image_signed_id) { nil }

      it "422エラーとエラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response["error"]).to eq("有効な画像が指定されていません")
      end
    end

    context "signed_idが有効な場合" do
      it "画像が更新され、200ステータスとメッセージが返る" do
        subject
        expect(response).to have_http_status(:ok)
        expect(json_response["message"]).to eq("画像を変更しました！")
        expect(profile.reload.avatar).to be_attached
      end
    end
  end
end
