FirebaseIdToken.configure do |config|
  config.redis = Redis.new(url: ENV.fetch("REDIS_URL", "redis://127.0.0.1:6379/0"))
  config.project_ids = [ENV["FIREBASE_PROJECT_ID"]]
end

Rails.application.config.after_initialize do
  FirebaseIdToken::Certificates.request
end
