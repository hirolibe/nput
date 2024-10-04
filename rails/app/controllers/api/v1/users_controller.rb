class Api::V1::UsersController < Api::V1::ApplicationController
  before_action :authenticate_user!

  def show
    render json: current_user, status: :ok, serializer: UserSerializer
  end
end
