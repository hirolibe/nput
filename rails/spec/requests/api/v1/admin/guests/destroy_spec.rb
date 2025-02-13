require "rails_helper"

RSpec.describe "Api::V1::Admin::Guests DELETE /api/v1/admin/guests/destroy_all", type: :request do
  subject { delete(destroy_all_api_v1_admin_guests_path, headers:) }

  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "管理者認証エラー"

  context "管理者認証に成功した場合" do
    let(:administrator) { create(:user, role: "admin") }

    before do
      login_as(administrator)
      stub_firebase_account_deletion
      create(:user, guest: true)
    end

    include_examples "リソースの削除成功", "すべてのゲストユーザー"
  end
end
