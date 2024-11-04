require "rails_helper"

RSpec.describe "Api::V1::Followers GET /api/v1/users/:user_id/followers", type: :request do
  subject { get(api_v1_user_followers_path(user_id, params)) }

  let(:following) { create(:user) }
  let(:user_id) { following.id }
  let(:params) { nil }

  before { create_list(:relationship, 20, following:) }

  include_examples "リソース不在エラー", "アカウント", "user_id"
  include_examples "ページネーションのテスト", "アカウント"
end
