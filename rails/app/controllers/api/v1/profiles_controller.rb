class Api::V1::ProfilesController < Api::V1::ApplicationController
  before_action :authenticate_user!, only: :create

  def create
    profile = current_user.profile || current_user.create_profile!

    render json: profile, status: :ok
  end
end
