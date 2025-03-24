module CognitoAuthenticatable
  extend ActiveSupport::Concern

  private

    def cognito_token
      request.headers["Authorization"]&.split&.last
    end

    def verify(token)
      return if token.blank?

      # Cognitoの設定を取得
      config = fetch_cognito_config

      # トークン検証を実行
      verify_with_retry(token, config)
    end

    def fetch_cognito_config
      {
        region: ENV["AWS_REGION"] || "ap-northeast-1",
        user_pool_id: ENV["COGNITO_USER_POOL_ID"],
        client_id: ENV["COGNITO_CLIENT_ID"],
        client_secret: ENV["COGNITO_CLIENT_SECRET"],
      }
    end

    def verify_with_retry(token, config)
      # 通常のトークン検証
      create_token_service(config).verify_token(token)
    rescue => e
      Rails.logger.error("トークン検証エラー: #{e.message}")
      # キャッシュを無効にして再検証
      retry_verification(token, config)
    end

    def retry_verification(token, config)
      create_token_service(config).verify_token(token, use_cache: false)
    rescue => e
      raise "トークン検証エラー: #{e.message}"
    end

    def create_token_service(config)
      TokenService.new(
        config[:region],
        config[:user_pool_id],
        config[:client_id],
        config[:client_secret],
      )
    end
end
