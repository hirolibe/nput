require "rails_helper"

RSpec.describe "Api::V1::Roles GET /api/v1/role", type: :request do
  subject { get(api_v1_role_path, headers:) }

  let(:current_user) { create(:user, role: "admin") }
  let(:headers) { { Authorization: "Bearer token" } }

  before { stub_token_verification.and_return({ "sub" => current_user.uid }) }

  it "200ステータス、ユーザーの権限情報が返る" do
    subject
    expect(response).to have_http_status(:ok)
    expect(json_response.keys).to eq ["role"]
    expect(json_response["role"]).to eq("admin")
  end
end
