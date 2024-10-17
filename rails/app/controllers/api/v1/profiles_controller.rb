class Api::V1::ProfilesController < ApplicationController
  def show
    user = User.find(params[:id])
    profile = user.profile

    if profile.present?
      render json: profile, status: :ok
    else
      render json: { error: "プロフィールが見つかりません" }, status: :not_found
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "アカウントが見つかりません" }, status: :not_found
  end
end
