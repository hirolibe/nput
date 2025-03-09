module CognitoAuthenticatable
  extend ActiveSupport::Concern
  include JwtVerification

  private

    def cognito_token
      request.headers["Authorization"]&.split&.last
    end

    def verify(token)
      return if token.blank?

      # Cognitoの設定
      region = ENV["AWS_REGION"] || "ap-northeast-1"
      user_pool_id = ENV["COGNITO_USER_POOL_ID"]
      client_id = ENV["COGNITO_CLIENT_ID"]

      # まずキャッシュからJWKSを取得して検証を試みる
      begin
        jwks = fetch_jwks(region, user_pool_id, use_cache: true)
        verify_token_with_jwks(token, jwks, region, user_pool_id, client_id)
      rescue JSON::JWT::VerificationFailed, JWT::DecodeError => e
        Rails.logger.info("キャッシュされたJWKSでの検証に失敗しました: #{e.message}")

        # キャッシュを無視して新しいJWKSを取得して再検証
        begin
          jwks = fetch_jwks(region, user_pool_id, use_cache: false)
          verify_token_with_jwks(token, jwks, region, user_pool_id, client_id)
        rescue => e
          Rails.logger.error("新しいJWKSでの検証にも失敗しました: #{e.message}")
          raise "トークン検証エラー: #{e.message}"
        end
      rescue => e
        Rails.logger.error("未知のエラー: #{e.message}")
        raise "トークン検証に失敗しました: #{e.message}"
      end
    end
end
