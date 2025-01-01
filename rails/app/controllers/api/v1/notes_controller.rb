class Api::V1::NotesController < Api::V1::ApplicationController
  include Pagination

  def index
    notes = Note.includes(
      user: { profile: { avatar_attachment: :blob } },
      tags: {},
    ).published.
              order(published_at: :desc).
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
  end

  def show
    user = User.find_by(name: params[:name])
    unless user
      return render json: { error: "アカウントにアクセスできません" }, status: :not_found
    end

    note = user.notes.includes(
      comments: { user: { profile: { avatar_attachment: :blob } } },
      tags: {},
    ).published.find_by(slug: params[:slug])

    if note
      render json: note,
             include: ["comments", "comments.user", "comments.user.profile", "user", "user.profile", "tags"],
             status: :ok
    else
      render json: { error: "ノートにアクセスできません" }, status: :not_found
    end
  end
end
