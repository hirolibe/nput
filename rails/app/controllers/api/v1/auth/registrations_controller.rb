class Api::V1::Auth::RegistrationsController < Api::V1::ApplicationController
  def create
    unless valid_token?
      return
    end

    if create_user_with_consent
      render json: { message: "新規登録に成功しました！" }, status: :created
    end
  end

  private

    def valid_token?
      if cognito_token.blank?
        render json: { error: "トークンが見つかりません" }, status: :bad_request
        return false
      end

      begin
        @decoded_token = verify(cognito_token)
      rescue => e
        Rails.logger.error(e.message)
        render json: { error: e.message }, status: :unauthorized
        return false
      end

      if @decoded_token.blank?
        render json: { error: "認証情報が無効です" }, status: :unauthorized
        return false
      end

      true
    end

    def create_user_with_consent
      ActiveRecord::Base.transaction do
        user = build_user
        save_consent(user)
        true
      end
    rescue ActiveRecord::RecordInvalid => e
      render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
      false
    end

    def build_user
      user = User.new(
        uid: @decoded_token["sub"],
        email: @decoded_token["email"],
        name: params[:name],
      )
      user.save!
      user
    end

    def save_consent(user)
      user.consents.create!(
        terms_version: params[:terms_version],
        privacy_version: params[:privacy_version],
        consent_date: params[:consent_date],
      )
    end
end
