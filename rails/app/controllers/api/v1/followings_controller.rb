class Api::V1::FollowingsController < Api::V1::ApplicationController
  include Pagination
  before_action :fetch_authenticated_current_user, only: [:index]

  def index
    follower = User.find(params[:user_id])
    users = follower.followings.
              includes(profile: { avatar_attachment: :blob }).
              order("relationships.created_at DESC").
              page(params[:page] || 1).
              per(10)
    render json: users,
           current_user:,
           meta: pagination(users),
           adapter: :json,
           status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "アカウントにアクセスできません" }, status: :not_found
  end
end
