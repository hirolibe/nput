require "rails_helper"

RSpec.describe "Api::V1::Admin::Users GET /api/v1/admin/users", type: :request do
  subject { get(api_v1_admin_users_path(params), headers:) }

  let(:params) { nil }
  let(:headers) { { Authorization: "Bearer token" } }
  let(:administrator) { create(:user, role: "admin") }

  include_examples "管理者認証エラー"

  context "管理者認証に成功した場合" do
    before do
      create_list(:user, 51)
      login_as(administrator)
    end

    include_examples "ページネーションのテスト", "アカウント管理情報"
  end
end
