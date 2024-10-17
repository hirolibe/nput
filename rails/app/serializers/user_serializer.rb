class UserSerializer < ActiveModel::Serializer
  attributes :id, :display_name, :bio, :avatar_url, :sns_link_x, :sns_link_github, :cheer_points
end
