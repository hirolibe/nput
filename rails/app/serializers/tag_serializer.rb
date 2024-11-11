class TagSerializer < ActiveModel::Serializer
  attributes :id, :name, :notes_count
end
