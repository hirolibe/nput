class AdminUserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :role
end
