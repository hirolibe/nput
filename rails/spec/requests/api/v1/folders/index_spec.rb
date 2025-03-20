require "rails_helper"

RSpec.describe "Api::V1::Folders GET /api/v1/:name/folders", type: :request do
  subject { get(api_v1_user_folders_path(name, params)) }

  let(:user) { create(:user) }
  let(:name) { user.name }
  let(:params) { nil }

  before { create_list(:folder, 11, user:) }

  include_examples "ページネーションのテスト", "フォルダ"
end
