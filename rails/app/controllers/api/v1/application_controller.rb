class Api::V1::ApplicationController < ApplicationController
  private

    def firebase_token
      request.headers["Authorization"]&.split&.last
    end

    def verify_token
      @decoded_token = FirebaseIdToken::Signature.verify(firebase_token)
    end

    def authenticate_user!
      if firebase_token.blank?
        return render json: { error: "ログインしてください" }, status: :bad_request
      end

      begin
        verify_token
      rescue => e
        Rails.logger.error("Firebase認証エラー: #{e.message}")
        return render json: { error: e.message }, status: :unauthorized
      end

      if decoded_token.blank?
        return render json: { error: "認証情報が無効です　ログインし直してください" }, status: :unauthorized
      end

      @current_user = User.find_by(uid: decoded_token["sub"])

      if @current_user.blank?
        render json: { error: "アカウントが見つかりません　新規登録してください" }, status: :unauthorized
      end
    end

    attr_reader :decoded_token, :current_user
end
