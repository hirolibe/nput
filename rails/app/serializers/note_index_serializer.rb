class NoteIndexSerializer < ActiveModel::Serializer
  attributes :id, :title, :from_today, :cheers_count, :has_cheered

  belongs_to :user

  def from_today
    TimeCalculateHelper.time_passed_from(object.published_at)
  end

  def has_cheered
    return nil unless @instance_options[:current_user]

    @instance_options[:current_user].has_cheered?(object)
  end
end
