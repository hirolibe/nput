require "rails_helper"

RSpec.describe "Api::V1::Admin::Users DELETE /api/v1/admin/users/[:id]", type: :request do
  subject { delete(api_v1_admin_user_path(id), headers:) }

  let(:headers) { { Authorization: "Bearer token" } }
  let(:non_administrator) { create(:user, role: "user") }
  let(:id) { non_administrator.id }

  include_examples "管理者認証エラー"

  context "管理者認証に成功した場合" do
    let(:administrator) { create(:user, role: "admin") }
    before { login_as(administrator) }

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
      before { stub_firebase_account_deletion }

      include_examples "リソースの削除成功", "アカウント"
    end
  end
end
