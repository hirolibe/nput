class ProfileSerializer < ActiveModel::Serializer
  attributes :id,
             :nickname,
             :bio,
             :x_link,
             :github_link,
             :cheer_points,
             :avatar_url,
             :cheers_count

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

  def cheers_count
    object.user.cheers_count
  end
end
