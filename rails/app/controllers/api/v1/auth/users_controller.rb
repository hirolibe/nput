class Api::V1::Auth::UsersController < Api::V1::ApplicationController
  before_action :authenticate_user!

  def create
    current_user.email = current_payload["email"]

    if current_user.save
      render json: { user: current_user }, status: :created
    else
      render json: current_user.errors, status: :unprocessable_entity
    end
  end
end
