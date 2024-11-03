class ProfileSerializer < ActiveModel::Serializer
  attributes :id,
             :nickname,
             :bio,
             :x_link,
             :github_link,
             :avatar_url

  def x_link
    return unless object.x_username

    "https://x.com/#{object.x_username}"
  end

  def github_link
    return unless object.github_username

    "https://github.com/#{object.github_username}"
  end

  def avatar_url
    return unless object.avatar&.attached?

    Rails.application.routes.url_helpers.url_for(object.avatar)
  end
end
