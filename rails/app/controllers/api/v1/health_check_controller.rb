class Api::V1::HealthCheckController < Api::V1::ApplicationController
  skip_before_action :authenticate_user!

  def index
    render json: { message: "Success Health Check!" }, status: :ok
  end
end
