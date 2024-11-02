class NoteSerializer < ActiveModel::Serializer
  attributes :id,
             :title,
             :content,
             :status_jp,
             :published_date,
             :updated_date,
             :cheers_count,
             :has_cheered

  has_many :comments

  belongs_to :user

  def status_jp
    object.status_i18n
  end

  def published_date
    object.published_at&.strftime("%Y/%m/%d")
  end

  def updated_date
    object.updated_at.strftime("%Y/%m/%d")
  end

  def has_cheered
    return nil unless @instance_options[:current_user]
    @instance_options[:current_user].has_cheered?(object)
  end
end
