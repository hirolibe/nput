class BasicUserSerializer < ActiveModel::Serializer
  attributes :id, :has_followed

  has_one :profile

  def has_followed
    return nil unless @instance_options[:current_user]

    @instance_options[:current_user].has_followed?(object)
  end
end
