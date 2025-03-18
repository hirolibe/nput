class Api::V1::MyFiledNotesController < Api::V1::ApplicationController
  include Pagination
  before_action :authenticate_user!, only: [:index]
  before_action :restrict_guest_user!, only: [:index]

  def index
    folder = current_user.folders.find_by(folder_name: params[:folder_name])
    unless folder
      return render json: { error: "フォルダにアクセスできません" }, status: :not_found
    end

    notes = folder.notes.
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
  end
end
