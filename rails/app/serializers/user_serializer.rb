class UserSerializer < ActiveModel::Serializer
  attributes :id, :display_name, :bio, :avatar_url, :sns_link_x, :sns_link_github, :cheer_points

  def display_name
    object.profile&.nickname || object.name
  end

  def bio
    object.profile&.bio
  end

  def avatar_url
    if object.profile&.avatar&.attached?
      Rails.application.routes.url_helpers.url_for(object.profile.avatar)
    else
      object.profile&.firebase_avatar_url
    end
  end

  def sns_link_x
    object.profile&.sns_link_x
  end

  def sns_link_github
    object.profile&.sns_link_github
  end

  def cheer_points
    object.profile&.cheer_points
  end
end
