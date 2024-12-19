class BasicUserSerializer < ActiveModel::Serializer
  attributes :name, :cheer_points

  has_one :profile
end
