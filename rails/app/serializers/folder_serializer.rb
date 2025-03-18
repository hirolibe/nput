class FolderSerializer < ActiveModel::Serializer
  attributes :id, :folder_name, :notes_count
end
