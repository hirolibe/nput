class TokenVerifier
  def perform_token_verification(token, jwks, auth_options)
    jwt_header = decode_token_header(token)
    jwk = find_matching_jwk(jwks, jwt_header[:kid])
    jwt = verify_token_signature(token, jwk)

    # 各種検証を実行
    verify_token_issuer(jwt, auth_options[:region], auth_options[:user_pool_id])
    verify_token_audience(jwt, auth_options[:client_id])
    verify_token_expiration(jwt)
    verify_token_nbf(jwt)

    jwt
  end

  private

    def decode_token_header(token)
      JSON::JWT.decode(token, :skip_verification).header
    rescue => e
      Rails.logger.error("トークンヘッダーの解析に失敗しました: #{e.message}")
      raise "トークンの形式が無効です"
    end

    def find_matching_jwk(jwks, kid)
      jwk = jwks[:keys].find {|key| key[:kid] == kid }
      unless jwk
        Rails.logger.error("対応するJWKが見つかりません")
        raise "対応する認証キーが見つかりません"
      end
      jwk
    end

    def verify_token_signature(token, jwk)
      public_key = JSON::JWK.new(jwk).to_key
      JSON::JWT.decode(token, public_key)
    end

    def verify_token_issuer(jwt, region, user_pool_id)
      iss = "https://cognito-idp.#{region}.amazonaws.com/#{user_pool_id}"
      unless jwt[:iss] == iss
        Rails.logger.error("発行者が一致しません: #{jwt[:iss]} != #{iss}")
        raise "無効な認証トークンです：発行者が一致しません"
      end
    end

    def verify_token_audience(jwt, client_id)
      unless jwt[:aud] == client_id || (jwt[:client_id] && jwt[:client_id] == client_id)
        Rails.logger.error("オーディエンスが一致しません")
        raise "無効な認証トークンです：対象クライアントが一致しません"
      end
    end

    def verify_token_expiration(jwt)
      if Time.current.to_i > jwt[:exp]
        Rails.logger.error("トークンの有効期限が切れています")
        raise "認証トークンの有効期限が切れています"
      end
    end

    def verify_token_nbf(jwt)
      if jwt[:nbf] && Time.current.to_i < jwt[:nbf]
        Rails.logger.error("トークンはまだ有効ではありません")
        raise "認証トークンはまだ有効ではありません"
      end
    end
end
