class TokenRefresher
  def initialize(region, client_id, client_secret = nil)
    @region = region
    @client_id = client_id
    @client_secret = client_secret
  end

  def refresh_auth_tokens(refresh_token)
    # リクエスト準備
    uri = URI("https://cognito-idp.#{@region}.amazonaws.com")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    # リクエスト作成
    request = Net::HTTP::Post.new(uri.path)
    request["Content-Type"] = "application/x-amz-json-1.1"
    request["X-Amz-Target"] = "AWSCognitoIdentityProviderService.InitiateAuth"

    # リクエストパラメータ作成
    auth_params = build_auth_params(refresh_token)
    request.body = auth_params.to_json

    # リクエスト送信
    response = http.request(request)
    process_auth_response(response, refresh_token)
  end

  private

    def build_auth_params(refresh_token)
      auth_params = {
        "AuthFlow" => "REFRESH_TOKEN_AUTH",
        "ClientId" => @client_id,
        "AuthParameters" => {
          "REFRESH_TOKEN" => refresh_token,
        },
      }

      # クライアントシークレットがある場合は追加
      if @client_secret.present?
        auth_params["AuthParameters"]["SECRET_HASH"] = compute_secret_hash(refresh_token)
      end

      auth_params
    end

    def compute_secret_hash(username)
      hmac = OpenSSL::HMAC.digest(
        OpenSSL::Digest.new("sha256"),
        @client_secret,
        username + @client_id,
      )
      Base64.strict_encode64(hmac)
    end

    def process_auth_response(response, refresh_token)
      unless response.is_a?(Net::HTTPSuccess)
        error_body = begin
          JSON.parse(response.body)
        rescue
          { "message" => "Unknown error" }
        end
        Rails.logger.error("トークン更新に失敗しました: #{response.code} #{error_body["message"]}")
        raise "トークン更新に失敗しました: #{error_body["message"]}"
      end

      result = JSON.parse(response.body, symbolize_names: true)

      {
        id_token: result[:AuthenticationResult][:IdToken],
        access_token: result[:AuthenticationResult][:AccessToken],
        refresh_token: result[:AuthenticationResult][:RefreshToken] || refresh_token,
        expires_in: result[:AuthenticationResult][:ExpiresIn],
      }
    end
end
