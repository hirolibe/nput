require "rails_helper"

RSpec.describe "Api::V1::Tags GET /api/v1/tags", type: :request do
  subject { get(api_v1_tags_path) }

  before do
    create_list(:tag, 20)
  end

  it "200ステータスとタグの情報が返る" do
    subject
    expect(response).to have_http_status(:ok)
    expect(json_response[0].keys).to eq ["id", "name", "notes_count"]
  end
end
