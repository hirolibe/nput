class Api::V1::ProfilesController < Api::V1::ApplicationController
  before_action :authenticate_user!, only: [:show, :update]

  def show
    profile = current_user.profile

    render json: profile, status: :ok
  end

  def update
    profile = current_user.profile

    if profile.update(profile_params)
      render json: { profile: ProfileSerializer.new(profile), message: "プロフィールを更新しました！" }, status: :ok
    else
      render json: { errors: profile.errors.full_messates }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "プロフィールが見つかりません" }, status: :not_found
  end

  private

    def profile_params
      params.require(:profile).permit(:id, :nickname, :bio, :x_username, :github_username, :cheer_points)
    end
end
