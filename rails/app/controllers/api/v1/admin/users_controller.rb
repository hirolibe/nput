class Api::V1::Admin::UsersController < Api::V1::ApplicationController
  before_action :authenticate_admin!, only: [:index, :destroy]
  include Pagination

  def index
    users = User.all.
              page(params[:page] || 1).
              per(50)
    render json: users,
           each_serializer: AdminUserSerializer,
           meta: pagination(users),
           adapter: :json,
           status: :ok
  end

  def destroy
    user = User.find(params[:id])
    validate_user_deletion(user)
    user.destroy!
    render json: { message: "アカウントを削除しました" }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "アカウントにアクセスできません" }, status: :not_found
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

    def validate_user_deletion(user)
      if user == current_user
        raise "自分のアカウントは削除できません"
      end
    end
end
