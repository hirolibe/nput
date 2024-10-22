class Api::V1::Auth::RegistrationsController < Api::V1::ApplicationController
  def create
    if firebase_token.blank?
      return render json: { error: "トークンが見つかりません　新規登録し直してください" }, status: :bad_request
    end

    begin
      decoded_token = verify_token
    rescue => e
      Rails.logger.error("Firebase認証エラー: #{e.message}")
      return render json: { error: e.message }, status: :unauthorized
    end

    if decoded_token.blank?
      return render json: { error: "認証情報が無効です　登録し直してください" }, status: :unauthorized
    end

    user = User.new(uid: decoded_token["sub"])
    user.email = decoded_token["email"]

    if user.save
      render json: { message: "ユーザー登録に成功しました！" }, status: :created
    else
      render json: user.errors, status: :unprocessable_entity
    end
  end
end
