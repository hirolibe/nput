require "rails_helper"

RSpec.describe "Api::V1::Followings GET /api/v1/users/:user_id/followings", type: :request do
  subject { get(api_v1_user_followings_path(user_id, params)) }

  let(:follower) { create(:user) }
  let(:user_id) { follower.id }
  let(:params) { nil }

  before { create_list(:relationship, 20, follower:) }

  include_examples "リソース不在エラー", "アカウント", "user_id"
  include_examples "ページネーションのテスト", "アカウント"
end
