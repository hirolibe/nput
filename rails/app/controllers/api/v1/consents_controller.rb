class Api::V1::ConsentsController < Api::V1::ApplicationController
  before_action :authenticate_user!, only: [:create]
  before_action :restrict_guest_user!, only: [:create]

  def create
    current_user.consents.create!(consent_params)
    render status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  private

    def consent_params
      params.require(:consent).permit(:terms_version, :privacy_version, :consent_date)
    end
end
