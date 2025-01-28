require "googleauth"

FirebaseIdToken.configure do |config|
  config.redis = Redis.new(url: ENV.fetch("REDIS_URL", "redis://redis:6379/0"))
  config.project_ids = [ENV["FIREBASE_PROJECT_ID"]]
end
