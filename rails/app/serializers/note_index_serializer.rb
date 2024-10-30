class NoteIndexSerializer < ActiveModel::Serializer
  attributes :id, :title, :from_today, :cheers_count

  belongs_to :user

  def from_today
    TimeCalculateHelper.time_passed_from(object.published_at)
  end
end
