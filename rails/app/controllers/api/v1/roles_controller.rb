class Api::V1::RolesController < Api::V1::ApplicationController
  before_action :authenticate_user!, only: [:show]

  def show
    role = current_user.role

    render json: { role: }, status: :ok
  end
end
