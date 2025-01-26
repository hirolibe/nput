class ProfileSerializer < ActiveModel::Serializer
  attributes :id,
             :nickname,
             :bio,
             :x_username,
             :x_link,
             :github_username,
             :github_link,
             :avatar_url

  belongs_to :user, serializer: BasicUserSerializer

  def x_link
    return unless object.x_username

    object.x_username
  end

  def github_link
    return unless object.github_username

    object.github_username
  end

  def avatar_url
    return unless object.avatar&.attached?

    Rails.application.routes.url_helpers.url_for(object.avatar)
  end
end
