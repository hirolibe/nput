require "rails_helper"

RSpec.describe "Api::V1::Notes GET /api/v1/my_notes", type: :request do
  subject { get(api_v1_my_notes_path(params), headers:) }

  let(:params) { nil }
  let(:headers) { { Authorization: "Bearer token" } }
  let(:user) { create(:user) }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before do
      stub_token_verification.and_return({ "sub" => user.uid })
      create_list(:note, 10, status: :published, user:)
      create_list(:note, 10, status: :draft, user:)
    end

    include_examples "ページネーションのテスト", "ノート"
  end
end
