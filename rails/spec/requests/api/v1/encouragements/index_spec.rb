require "rails_helper"

RSpec.describe "Api::V1::Encouragements GET /api/v1/users/:user_id/encouragements", type: :request do
  subject { get(api_v1_user_encouragements_path(user_id, params)) }

  let(:user) { create(:user) }
  let(:user_id) { user.id }
  let(:params) { nil }

  before do
    create_list(:cheer, 20, user:)
  end

  include_examples "リソース不在エラー", "アカウント", "user_id"

  context "アカウントが存在する場合" do
    include_examples "ページネーション付きノート一覧の取得"
  end
end
