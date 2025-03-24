class TokenService
  require "json/jwt"
  require "net/http"
  require "openssl"

  def initialize(region, user_pool_id, client_id, client_secret = nil)
    @region = region
    @user_pool_id = user_pool_id
    @client_id = client_id
    @client_secret = client_secret
    @jwks_manager = JwksManager.new(region, user_pool_id)
    @token_verifier = TokenVerifier.new
    @token_refresher = TokenRefresher.new(region, client_id, client_secret)
  end

  def verify_token(token, refresh_token = nil, use_cache: true, auto_refresh: true, token_refresh_callback: nil)
    jwks = @jwks_manager.fetch_jwks(use_cache:)

    auth_options = {
      region: @region,
      user_pool_id: @user_pool_id,
      client_id: @client_id,
      auto_refresh:,
      refresh_token:,
      token_refresh_callback:,
    }

    verify_token_with_jwks(token, jwks, auth_options)
  end

  private

    def verify_token_with_jwks(token, jwks, auth_options)
      # トークン検証を実行
      @token_verifier.perform_token_verification(token, jwks, auth_options)
    rescue => e
      # トークン期限切れで自動更新が有効な場合
      raise e unless should_refresh_token?(e.message, auth_options)

      handle_token_refresh(token, jwks, auth_options)

      # その他のエラーはそのまま処理
    end

    def should_refresh_token?(error_message, auth_options)
      error_message == "認証トークンの有効期限が切れています" &&
        auth_options[:auto_refresh] &&
        auth_options[:refresh_token].present? &&
        auth_options[:token_refresh_callback].present?
    end

    def handle_token_refresh(token, jwks, auth_options)
      Rails.logger.info("トークンの有効期限が切れています。自動更新を試みます。")

      # トークンを更新
      new_tokens = @token_refresher.refresh_auth_tokens(auth_options[:refresh_token])

      # コールバック関数を使用して新しいトークンを保存
      auth_options[:token_refresh_callback].call(new_tokens)

      # 新しいトークンで再検証（自動更新は無効化して無限ループを防止）
      new_token = new_tokens[:id_token] || new_tokens[:access_token]
      new_options = auth_options.merge(auto_refresh: false)

      # 再検証実行
      @token_verifier.perform_token_verification(new_token, jwks, new_options)
    rescue => e
      Rails.logger.error("トークン自動更新に失敗しました: #{e.message}")
      raise "認証トークンの更新に失敗しました: #{e.message}"
    end
end
