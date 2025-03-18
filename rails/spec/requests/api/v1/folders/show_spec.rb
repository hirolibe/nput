require "rails_helper"

RSpec.describe "Api::V1::Folders GET /api/v1/:name/folders/:folder_name", type: :request do
  subject { get(api_v1_user_folder_path(name, folder_name)) }

  let(:user) { create(:user) }
  let(:name) { user.name }
  let(:folder) { create(:folder, user:) }
  let(:folder_name) { folder.folder_name }

  context "フォルダ名が存在しない場合" do
    let(:folder_name) { "non_exist_folder_name" }

    include_examples "404エラー", "フォルダ"
  end

  context "フォルダ名が存在する場合" do
    it "200ステータス、フォルダの情報が返る" do
      subject
      expect(response).to have_http_status(:ok)
      expect(json_response.keys).to eq EXPECTED_FOLDER_KEYS
    end
  end
end
