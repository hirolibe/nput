class BasicUserSerializer < ActiveModel::Serializer
  attributes :id

  has_one :profile
end
