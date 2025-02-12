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
      begin
        decoded_token = verify_token
      rescue => e
        Rails.logger.error("Firebase認証エラー: #{e.message}")
        return render json: { error: e.message }, status: :unauthorized
      end

      if decoded_token.blank?
        return render json: { error: "認証情報が無効です" }, status: :unauthorized
      end

      @current_user = User.find_by(uid: decoded_token["sub"])

      if @current_user.blank?
        render json: { error: "アカウントが見つかりません" }, status: :unauthorized
      end
    end

    def authenticate_user!
      if firebase_token.blank?
        return render json: { error: "トークンが見つかりません" }, status: :bad_request
      end

      fetch_authenticated_current_user
    end

    attr_reader :current_user

    def authenticate_admin!
      authenticate_user!
      return if performed?

      unless current_user&.admin?
        render json: { error: "アクセス権限がありません" }, status: :forbidden
      end
    end

    def delete_firebase_account(uid)
      conn = Faraday.new(url: "https://identitytoolkit.googleapis.com") do |f|
        f.request :json
        f.response :json
      end

      response = conn.post do |req|
        req.url "v1/projects/#{ENV["FIREBASE_PROJECT_ID"]}/accounts:delete"
        req.headers["Authorization"] = "Bearer #{firebase_admin_token}"
        req.body = { localId: uid }
      end

      unless response.success?
        raise "Firebaseのアカウント削除に失敗しました"
      end
    end

    def firebase_admin_token
      # 開発環境のAWS設定
      unless Rails.env.production?
        config = {
          region: ENV["AWS_REGION"],
          credentials: Aws::Credentials.new(ENV["AWS_ACCESS_KEY_ID"], ENV["AWS_SECRET_ACCESS_KEY"]),
        }
        updated_config = Aws.config.update(config)
        if updated_config.blank?
          raise "AWSの設定に失敗しました"
        end
      end

      # Secrets Managerから認証情報を取得
      json_content = Aws::SecretsManager::Client.new.
                       get_secret_value(secret_id: ENV["FIREBASE_CREDENTIALS"]).
                       secret_string

      # Firebaseトークンを取得して返す
      Google::Auth::ServiceAccountCredentials.
        make_creds(json_key_io: StringIO.new(json_content), scope: ["https://www.googleapis.com/auth/identitytoolkit"]).
        fetch_access_token!["access_token"]
    rescue => e
      raise "認証トークン取得エラー: #{e.message}"
    end

    def attach_images(record, signed_ids)
      return if signed_ids.blank?

      signed_ids.each do |signed_id|
        record.images.attach(signed_id)
      end
    end
end
