require 'rails_helper'

RSpec.describe "Api::V1::Users", type: :request do
  let!(:user) { create(:user) }

  describe "GET /api/v1/users/:id" do
    context "トークンが有効な場合" do
      before do
        stub_token_verification.and_return({"email" => user.email, "sub" => user.uid})
      end

      it "正常にレスポンスを返し、データベースのログインユーザーの情報を取得できる" do
        get api_v1_user_path(user), headers: { Authorization: "Bearer valid_token" }

        expect(response).to have_http_status(:success)
        expect(json_response['email']).to eq(user.email)
        expect(json_response['uid']).to eq(user.uid)
      end
    end

    context "トークンが欠落している場合" do
      it "認証エラーを返す" do
        get api_v1_user_path(user)

        expect(response).to have_http_status(:unauthorized)
        expect(json_response['error']).to eq("No token provided")
      end
    end

    context "トークンが無効な場合" do
      before do
        stub_token_verification.and_raise(StandardError)
      end

      it "トークンが無効であることを示すエラーを返す" do
        get api_v1_user_path(user), headers: { Authorization: "Bearer invalid_token" }

        expect(response).to have_http_status(:unauthorized)
        expect(json_response['error']).to eq("Invalid token")
      end
    end
  end
end
