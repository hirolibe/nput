class Api::V1::RelationshipsController < Api::V1::ApplicationController
  before_action :authenticate_user!, only: [:show, :create, :destroy]
  before_action :restrict_guest_user!, only: [:create, :destroy]

  def show
    following = User.find_by!(name: params[:name])
    follow_status = current_user.has_followed?(following)

    render json: { has_followed: follow_status }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "アカウントにアクセスできません" }, status: :not_found
  end

  def create
    following = User.find_by!(name: params[:name])
    current_user.following_relationships.create!(following:)

    render status: :created
  rescue ActiveRecord::RecordNotFound
    render json: { error: "アカウントにアクセスできません" }, status: :not_found
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def destroy
    following = User.find_by!(name: params[:name])
    relationship = current_user.following_relationships.find_by(following_id: following.id)

    if relationship
      relationship.destroy!
      render status: :ok
    else
      render json: { error: "このアカウントをフォローしていません" }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "アカウントにアクセスできません" }, status: :not_found
  rescue ActiveRecord::RecordNotDestroyed
    render json: { error: "フォローの解除に失敗しました" }, status: :unprocessable_entity
  end
end
