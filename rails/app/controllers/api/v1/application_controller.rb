class Api::V1::ApplicationController < ApplicationController
  include CognitoAuthenticatable

  private

    def fetch_authenticated_current_user
      if cognito_token.blank?
        return render json: { error: "トークンが見つかりません" }, status: :bad_request
      end

      begin
        decoded_token = verify(cognito_token)
      rescue => e
        Rails.logger.error(e.message)
        return render json: { error: e.message }, status: :unauthorized
      end

      if decoded_token.blank?
        return render json: { error: "認証情報が無効です" }, status: :unauthorized
      end

      @current_user = User.find_by(uid: decoded_token["sub"])
    end

    def authenticate_user!
      current_user = fetch_authenticated_current_user

      if current_user.blank?
        render json: { error: "アカウント登録が完了していません" }, status: :unauthorized
      end
    end

    attr_reader :current_user

    def authenticate_admin!
      authenticate_user!
      return if performed?

      unless current_user&.admin?
        render json: { error: "アクセス権限がありません" }, status: :forbidden
      end
    end

    def restrict_guest_user!
      if @current_user.guest?
        render json: { error: "ゲストユーザーはこの操作を実行できません" }, status: :forbidden
      end
    end
end
