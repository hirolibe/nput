class FolderSerializer < ActiveModel::Serializer
  attributes :id, :name, :notes_count, :slug
end
