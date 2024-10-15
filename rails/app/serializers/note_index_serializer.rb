class NoteIndexSerializer < ActiveModel::Serializer
  attributes :id, :title, :author_name, :from_today
end
