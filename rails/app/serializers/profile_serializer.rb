class ProfileSerializer < ActiveModel::Serializer
  attributes :id, :nickname, :bio, :firebase_avatar_url, :sns_link_x, :sns_link_github, :cheer_points
end
