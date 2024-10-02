class Api::V1::Auth::UsersController < Api::V1::ApplicationController
  def create
    current_user.email = current_payload['email']

    if current_user.save
      render json: { message: 'Success' }, status: :ok
    else
      render json: current_user.errors, status: :unprocessable_entity
    end
  end
end
