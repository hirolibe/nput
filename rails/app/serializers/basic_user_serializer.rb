class BasicUserSerializer < ActiveModel::Serializer
  attributes :name

  has_one :profile
end
