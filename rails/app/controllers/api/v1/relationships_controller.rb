class Api::V1::RelationshipsController < Api::V1::ApplicationController
  before_action :authenticate_user!, only: [:create]

  def create
    following = User.find(params[:user_id])
    current_user.following_relationships.create!(following:)
    render status: :created
  rescue ActiveRecord::RecordNotFound
    render json: { error: "アカウントにアクセスできません" }, status: :not_found
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end
end
