class UserSerializer < ActiveModel::Serializer
  attributes :id,
             :cheer_points,
             :cheers_count,
             :followings_count,
             :followers_count,
             :has_followed

  has_one :profile

  def has_followed
    return nil unless @instance_options[:current_user]

    @instance_options[:current_user].has_followed?(object)
  end
end
