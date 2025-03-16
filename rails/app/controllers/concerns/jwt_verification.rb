module JwtVerification
  extend ActiveSupport::Concern

  require "json/jwt"
  require "net/http"
  require "openssl"

  private

    def fetch_jwks(region, user_pool_id, use_cache: true)
      cache_key = "cognito_jwks_#{region}_#{user_pool_id}"

      # キャッシュを使用する場合は、キャッシュから取得
      if use_cache
        cached_jwks = Rails.cache.read(cache_key)
        return cached_jwks if cached_jwks.present?
      end

      # キャッシュがない、または無視する場合は新規取得
      jwks_uri = URI("https://cognito-idp.#{region}.amazonaws.com/#{user_pool_id}/.well-known/jwks.json")
      response = Net::HTTP.get_response(jwks_uri)

      unless response.is_a?(Net::HTTPSuccess)
        Rails.logger.error("JWKSの取得に失敗しました: #{response.code} #{response.message}")
        raise "JWKSの取得に失敗しました"
      end

      jwks = JSON.parse(response.body, symbolize_names: true)

      # 新しいJWKSをキャッシュ
      Rails.cache.write(cache_key, jwks, expires_in: 24.hours)

      jwks
    end

    def verify_token_with_jwks(token, jwks, region, user_pool_id, client_id)
      # メソッドを複数の小さな責任に分割する
      jwt_header = decode_token_header(token)
      jwk = find_matching_jwk(jwks, jwt_header[:kid])
      jwt = verify_token_signature(token, jwk)

      # 各種検証を実行
      verify_token_issuer(jwt, region, user_pool_id)
      verify_token_audience(jwt, client_id)
      verify_token_expiration(jwt)
      verify_token_nbf(jwt)

      # 検証済みのペイロードを返す
      jwt
    rescue JSON::JWT::VerificationFailed => e
      handle_verification_error(e, "JWT検証エラー", "トークン検証エラー: 署名が無効です")
    rescue JSON::JWK::UnknownAlgorithm => e
      handle_verification_error(e, "未知のアルゴリズムエラー", "トークン検証エラー: 未知のアルゴリズムです")
    rescue JSON::JWT::InvalidFormat => e
      handle_verification_error(e, "JWT形式エラー", "トークン検証エラー: 形式が無効です")
    rescue => e
      handle_verification_error(e, "未知のエラー", e.message)
    end

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

    def handle_verification_error(exception, log_message, error_message)
      Rails.logger.error("#{log_message}: #{exception.message}")
      raise error_message
    end
end
