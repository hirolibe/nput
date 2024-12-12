require "rails_helper"

RSpec.describe "Api::V1::Users DELETE /api/v1/:name", type: :request do
  subject { delete(api_v1_delete_user_path(name), headers:) }

  let(:headers) { { Authorization: "Bearer token" } }
  let(:user) { create(:user) }
  let(:name) { user.name }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => user.uid }) }

    include_examples "リソース不在エラー", "アカウント", "name"

    context "ログインユーザーが作成したアカウントではない場合" do
      let(:other_user) { create(:user) }
      let(:name) { other_user.name }

      it "403エラーとエラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:forbidden)
        expect(json_response["error"]).to eq("他のアカウントは削除できません")
      end
    end

    include_examples "リソースの削除成功", "アカウント"
  end
end
