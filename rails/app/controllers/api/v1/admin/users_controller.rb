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
      # file_path = ENV["FIREBASE_CREDENTIALS"]
      # json_content = File.read(file_path)

      # AWS SDKでSecrets Managerからシークレットを取得
      secret_name = ENV["FIREBASE_CREDENTIALS"] # Secrets ManagerのARNを環境変数から取得
      region = "ap-northeast-1" # 使用するリージョンを指定

      # AWS Secrets Managerクライアントの作成
      secrets_manager = Aws::SecretsManager::Client.new(region:)

      # Secrets Managerからシークレットの値を取得
      begin
        secret_value = secrets_manager.get_secret_value(secret_id: secret_name)
        json_content = secret_value.secret_string
      rescue Aws::SecretsManager::Errors::ServiceError => e
        raise "Unable to retrieve secret: #{e.message}"
      end

      credentials = Google::Auth::DefaultCredentials.make_creds(
        json_key_io: StringIO.new(json_content),
        scope: ["https://www.googleapis.com/auth/identitytoolkit"],
      )

      credentials.fetch_access_token!["access_token"]
    end
end
