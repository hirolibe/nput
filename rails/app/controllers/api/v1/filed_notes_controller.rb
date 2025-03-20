class Api::V1::FiledNotesController < Api::V1::ApplicationController
  include Pagination

  def index
    user, folder = find_user_and_folder
    return unless user && folder

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

  private

    def find_user_and_folder
      user = User.find_by(name: params[:name])
      unless user
        render json: { error: "アカウントにアクセスできません" }, status: :not_found
        return [nil, nil]
      end

      folder = user.folders.find_by(slug: params[:slug])
      unless folder
        render json: { error: "フォルダにアクセスできません" }, status: :not_found
        return [nil, nil]
      end

      [user, folder]
    end
end
