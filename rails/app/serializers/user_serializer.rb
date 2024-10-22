class UserSerializer < ActiveModel::Serializer
  attribute :id

  has_one :profile
end
