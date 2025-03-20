require "rails_helper"

RSpec.describe "Api::V1::MyFolders GET /api/v1/my_folders", type: :request do
  subject { get(api_v1_my_folders_path(params), headers:) }

  let(:params) { nil }
  let(:headers) { { Authorization: "Bearer token" } }
  let(:user) { create(:user) }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before do
      stub_token_verification.and_return({ "sub" => user.uid })
      create_list(:folder, 11, user:)
    end

    include_examples "ページネーションのテスト", "フォルダ"
  end
end
