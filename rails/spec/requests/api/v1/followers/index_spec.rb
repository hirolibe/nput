require "rails_helper"

RSpec.describe "Api::V1::Followers GET /api/v1/:name/followers", type: :request do
  subject { get(api_v1_user_followers_path(name, params)) }

  let(:following) { create(:user) }
  let(:name) { following.name }
  let(:params) { nil }

  before { create_list(:relationship, 80, following:) }

  include_examples "リソース不在エラー", "アカウント", "name"
  include_examples "ページネーションのテスト", "アカウント"
end
