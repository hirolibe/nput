class Api::V1::ApplicationController < ApplicationController
  before_action :authenticate_user!

  private

    def id_token
      request.headers["Authorization"]&.split&.last
    end

    def authenticate_user!
      return render json: { error: "No token provided" }, status: :unauthorized if id_token.blank?

      begin
        @payload = FirebaseIdToken::Signature.verify(id_token)

        return render json: { error: "Invalid token" }, status: :unauthorized if @payload.nil? || @payload["sub"].blank?

        @current_user = User.find_or_initialize_by(uid: @payload["sub"])
      rescue
        render json: { error: "Invalid token" }, status: :unauthorized
      end
    end

    attr_reader :current_user

    def current_payload
      @payload
    end
end
