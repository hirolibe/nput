class Api::V1::HealthCheckController < Api::V1::ApplicationController
  def index
    render json: { message: "Success Health Check!" }, status: :ok
  end
end
