class Api::V1::FollowingsController < Api::V1::ApplicationController
  include Pagination

  def index
    follower = User.find(params[:user_id])
    users = follower.followings.
              includes(profile: { avatar_attachment: :blob }).
              order("relationships.created_at DESC").
              page(params[:page] || 1).
              per(10)
    render json: users,
           each_serializer: BasicUserSerializer,
           meta: pagination(users),
           adapter: :json,
           status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "アカウントにアクセスできません" }, status: :not_found
  end
end
