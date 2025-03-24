module JwtVerification
  extend ActiveSupport::Concern

  private

    # トークン認証を実行
    def authenticate_with_token
      token = extract_token_from_header
      refresh_token = session[:refresh_token]

      begin
        # TokenServiceを使用してトークンを検証
        token_service = TokenService.new(
          ENV["AWS_REGION"],
          ENV["COGNITO_USER_POOL_ID"],
          ENV["COGNITO_CLIENT_ID"],
          ENV["COGNITO_CLIENT_SECRET"],
        )

        jwt = token_service.verify_token(
          token,
          refresh_token,
          auto_refresh: true,
          token_refresh_callback: method(:store_new_tokens),
        )

        # 認証成功
        @current_user = User.find_by(cognito_sub: jwt[:sub])
      rescue => e
        # 認証エラー処理
        handle_authentication_error(e)
      end
    end

    # リクエストヘッダーからトークンを抽出
    def extract_token_from_header
      authorization = request.headers["Authorization"]

      if authorization.blank?
        raise "Authorization headerが見つかりません"
      end

      # Bearer スキームからトークンを抽出
      raise "無効なAuthorization headerの形式です" unless authorization.start_with?("Bearer ")

      authorization.gsub("Bearer ", "")
    end

    # 新しいトークンを保存するコールバック
    def store_new_tokens(tokens)
      session[:access_token] = tokens[:access_token]
      session[:id_token] = tokens[:id_token]
      session[:refresh_token] = tokens[:refresh_token] if tokens[:refresh_token]

      # オプション: レスポンスヘッダーにも新しいトークンを設定
      response.headers["X-New-Access-Token"] = tokens[:access_token]
    end

    # 認証エラーの処理
    def handle_authentication_error(exception)
      Rails.logger.error("認証エラー: #{exception.message}")
      render json: { error: exception.message }, status: :unauthorized
    end
end
