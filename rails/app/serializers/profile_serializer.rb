class ProfileSerializer < ActiveModel::Serializer
  attributes :id, :nickname, :bio, :x_username, :github_username, :cheer_points, :avatar_url

  def avatar_url
    return unless object.avatar&.attached?

    Rails.application.routes.url_helpers.url_for(object.avatar)
  end
end
