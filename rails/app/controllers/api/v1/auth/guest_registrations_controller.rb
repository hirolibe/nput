class Api::V1::Auth::GuestRegistrationsController < Api::V1::ApplicationController
  def create
    if firebase_token.blank?
      return render json: { error: "トークンが見つかりません" }, status: :bad_request
    end

    begin
      decoded_token = verify_token
    rescue => e
      Rails.logger.error("Firebase認証エラー: #{e.message}")
      return render json: { error: e.message }, status: :unauthorized
    end

    if decoded_token.blank?
      return render json: { error: "認証情報が無効です" }, status: :unauthorized
    end

    user = User.new(uid: decoded_token["sub"], email: generate_random_email, name: generate_random_name)

    if user.save
      render json: { message: "ゲストとしてログインしました！" }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

    def generate_random_email
      "guest_#{SecureRandom.hex(5)}@example.com"
    end

    def generate_random_name
      "Guest_#{SecureRandom.hex(5)}"
    end
end
