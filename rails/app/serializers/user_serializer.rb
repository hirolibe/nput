class UserSerializer < ActiveModel::Serializer
  attributes :id, :cheer_points, :cheers_count

  has_one :profile
end
