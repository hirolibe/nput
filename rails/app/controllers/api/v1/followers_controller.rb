class Api::V1::FollowersController < Api::V1::ApplicationController
  include Pagination

  def index
    following = User.find_by!(name: params[:name])
    users = following.followers.
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
