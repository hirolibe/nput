class Api::V1::SearchedNotesController < Api::V1::ApplicationController
  include Pagination

  def index
    notes = Note.includes(
      user: { profile: { avatar_attachment: :blob } },
      tags: {},
    ).published
      .search_by_query(search_params[:q])
      .order(published_at: :desc)

    notes_per_page = notes.page(params[:page] || 1)
      .per(10)

    total_durations = Note.calculate_total_durations(notes)

    render json: notes_per_page,
           each_serializer: NoteIndexSerializer,
           total_durations:,
           meta: {
             **pagination(notes_per_page),
             notes_count: notes.count,
           },
           include: ["user", "user.profile", "tags"],
           adapter: :json,
           status: :ok
  end

  private

    def search_params
      params.permit(:q, :page)
    end
end
