class Api::V1::TaggedNotesController < Api::V1::ApplicationController
  include Pagination

  def index
    tag = Tag.find_by!(name: params[:name])
    notes = tag.notes.
              includes(
                user: { profile: { avatar_attachment: :blob } },
                tags: {},
              ).published.
              order("notes.published_at DESC").
              page(params[:page] || 1).
              per(10)

    total_durations = Duration.where(note_id: notes.map(&:id)).group(:note_id).sum(:duration)

    render json: notes,
           each_serializer: NoteIndexSerializer,
           total_durations:,
           include: ["user", "user.profile", "tags"],
           meta: pagination(notes),
           adapter: :json,
           status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "タグにアクセスできません" }, status: :not_found
  end
end
