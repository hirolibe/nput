class Api::V1::RolesController < Api::V1::ApplicationController
  before_action :fetch_authenticated_current_user, only: [:show]

  def show
    role = current_user&.role

    render json: { role: }, status: :ok
  end
end
