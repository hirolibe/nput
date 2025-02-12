require "rails_helper"

RSpec.describe "Api::V1::Admin::Users GET /api/v1/admin/users", type: :request do
  subject { get(api_v1_admin_users_path(params), headers:) }

  let(:user) { create(:user, role: "admin") }
  let(:params) { nil }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before do
      create_list(:user, 51)
      login_as_admin(user)
    end

    include_examples "ページネーションのテスト", "アカウント管理情報"
  end
end
