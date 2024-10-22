class Api::V1::UsersController < Api::V1::ApplicationController
  def show
    user = User.find(params[:id])

    render json: user, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "アカウントが見つかりません" }, status: :not_found
  end
end
