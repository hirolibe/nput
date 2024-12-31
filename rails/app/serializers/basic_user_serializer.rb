class BasicUserSerializer < ActiveModel::Serializer
  attributes :name, :cheer_points, :cheers_count

  has_one :profile
end
