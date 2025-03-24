class JwksManager
  def initialize(region, user_pool_id)
    @region = region
    @user_pool_id = user_pool_id
  end

  def fetch_jwks(use_cache: true)
    cache_key = "cognito_jwks_#{@region}_#{@user_pool_id}"

    # キャッシュを使用する場合は、キャッシュから取得
    if use_cache
      cached_jwks = Rails.cache.read(cache_key)
      return cached_jwks if cached_jwks.present?
    end

    # キャッシュがない、または無視する場合は新規取得
    jwks_uri = URI("https://cognito-idp.#{@region}.amazonaws.com/#{@user_pool_id}/.well-known/jwks.json")
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
end
