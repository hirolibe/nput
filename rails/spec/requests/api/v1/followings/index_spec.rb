require "rails_helper"

RSpec.describe "Api::V1::Followings GET /api/v1/:name/followings", type: :request do
  subject { get(api_v1_user_followings_path(name, params)) }

  let(:follower) { create(:user) }
  let(:name) { follower.name }
  let(:params) { nil }

  before { create_list(:relationship, 80, follower:) }

  include_examples "リソース不在エラー", "アカウント", "name"
  include_examples "ページネーションのテスト", "アカウント"
end
