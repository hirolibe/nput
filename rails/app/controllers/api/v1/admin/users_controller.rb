class Api::V1::Admin::UsersController < Api::V1::ApplicationController
  before_action :authenticate_admin!, only: [:index, :destroy]
  include Pagination

  def index
    users = User.all.
              page(params[:page] || 1).
              per(50)
    render json: users,
           each_serializer: AdminUserSerializer,
           meta: pagination(users),
           adapter: :json,
           status: :ok
  end

  def destroy
    user = User.find(params[:id])
    validate_user_deletion(user)
    delete_user(user)
    render json: { message: "アカウントを削除しました" }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "アカウントにアクセスできません" }, status: :not_found
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

    def validate_user_deletion(user)
      if user == current_user
        raise "自分のアカウントは削除できません"
      end
    end

    def delete_user(user)
      ActiveRecord::Base.transaction do
        user.destroy!
        delete_firebase_account(user.uid)
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
end
