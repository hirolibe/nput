require "rails_helper"

RSpec.describe "Api::V1::Admin::Users DELETE /api/v1/admin/users/[:id]", type: :request do
  subject { delete(api_v1_admin_user_path(id), headers:) }

  let(:headers) { { Authorization: "Bearer token" } }
  let(:user) { create(:user) }
  let(:id) { user.id }

  include_examples "管理者認証エラー"

  context "管理者認証に成功した場合" do
    let(:administrator) { create(:user, role: "admin") }

    before { stub_token_verification.and_return({ "sub" => administrator.uid }) }

    include_examples "リソース不在エラー", "アカウント", "id"

    context "管理者のアカウントを削除しようとした場合" do
      let(:id) { administrator.id }

      it "エラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response["error"]).to eq("自分のアカウントは削除できません")
      end
    end

    context "管理者以外のアカウントを削除する場合" do
      include_examples "リソースの削除成功", "アカウント"
    end
  end
end
