class Api::V1::FollowsController < Api::V1::ApplicationController
  before_action :authenticate_user!, only: [:show]

  def show
    following = User.find(params[:user_id])
    follow_status = current_user.has_followed?(following)
    render json: { follow_status: }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "アカウントにアクセスできません" }, status: :not_found
  end
end
