require "rails_helper"

RSpec.describe "Api::V1::Relationships DELETE /api/v1/users/:user_id/relationship", type: :request do
  subject { delete(api_v1_user_relationship_path(user_id), headers:) }

  let(:follower) { create(:user) }
  let(:following) { create(:user) }
  let(:user_id) { following.id }
  let(:headers) { { Authorization: "Bearer token" } }

  include_examples "ユーザー認証エラー"

  context "ユーザー認証に成功した場合" do
    before { stub_token_verification.and_return({ "sub" => follower.uid }) }

    include_examples "リソース不在エラー", "アカウント", "user_id"

    context "アカウントをフォローしていない場合" do
      it "422エラーとエラーメッセージが返る" do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response["error"]).to eq("このアカウントをフォローしていません")
      end
    end

    context "すでにアカウントをフォローしている場合" do
      before { follower.following_relationships.create!(following:) }

      it "フォローを解除でき、200ステータスが返る" do
        subject
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
