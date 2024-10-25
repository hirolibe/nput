class Api::V1::UsersController < Api::V1::ApplicationController
  before_action :authenticate_user!, only: [:destroy]

  def show
    user = User.find(params[:id])
    render json: user, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "アカウントにアクセスできません" }, status: :not_found
  end

  def destroy
    user = User.find(params[:id])
    if user == current_user
      current_user.destroy!
      render json: { message: "アカウントを削除しました" }, status: :ok
    else
      render json: { error: "他のアカウントは削除できません" }, status: :forbidden
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "アカウントにアクセスできません" }, status: :not_found
  end
end
