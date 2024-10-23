require "rails_helper"

RSpec.describe "Api::V1::Users DELETE /api/v1/users/:id", type: :request do
  subject { delete(api_v1_user_path(user_id), headers:) }

  let(:headers) { { Authorization: "Bearer token" } }
  let(:user) { create(:user) }
  let(:user_id) { user.id }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    context "ログインユーザーのアカウントの場合" do
      it "正常にアカウントを削除でき、200ステータスとメッセージが返る" do
        subject
        expect(response).to have_http_status(:ok)
        expect(json_response["message"]).to eq("アカウントを削除しました")
      end
    end

    context "ログインユーザーのアカウントでない場合" do
      let(:other_user) { create(:user) }
      let(:user_id) { other_user.id }

      it "404エラーとエラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:forbidden)
        expect(json_response["error"]).to eq("他のアカウントは削除できません")
      end
    end
  end
end
