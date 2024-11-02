class Api::V1::ApplicationController < ApplicationController
  private

    def firebase_token
      request.headers["Authorization"]&.split&.last
    end

    def verify_token
      FirebaseIdToken::Certificates.request
      FirebaseIdToken::Signature.verify(firebase_token)
    end

    def fetch_authenticated_current_user
      unless firebase_token.present?
        @current_user = nil
        return
      end

      begin
        decoded_token = verify_token
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

    def authenticate_user!
      if firebase_token.blank?
        return render json: { error: "トークンが見つかりません　新規登録またはログインしてください" }, status: :bad_request
      end

      fetch_authenticated_current_user
    end

    attr_reader :current_user
end
