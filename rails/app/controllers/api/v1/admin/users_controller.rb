class Api::V1::Admin::UsersController < Api::V1::ApplicationController
  before_action :authenticate_admin!, only: [:index, :destroy]

  def index
    users = User.all
    render json: users, status: :ok
  end

  def destroy
    user = User.find(params[:id])
    if user.destroy
      render json: { message: "アカウントを削除しました" }, status: :ok
    else
      render json: { error: "アカウントの削除に失敗しました" }, status: :forbidden
    end
  end
end
