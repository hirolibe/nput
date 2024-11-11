class NoteIndexSerializer < ActiveModel::Serializer
  attributes :id, :title, :from_today, :cheers_count, :has_cheered, :total_duration

  has_many :tags

  belongs_to :user, serializer: BasicUserSerializer

  def from_today
    TimeCalculateHelper.time_passed_from(object.published_at)
  end

  def has_cheered
    return nil unless @instance_options[:current_user]

    @instance_options[:current_user].has_cheered?(object)
  end

  def total_duration
    instance_options[:total_durations][object.id]
  end
end
