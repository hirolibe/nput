class Api::V1::SearchedNotesController < Api::V1::ApplicationController
  include Pagination

  def index
    notes = find_notes
    paginated_notes = paginate_notes(notes)
    total_durations = Note.calculate_total_durations(paginated_notes)

    render json: paginated_notes,
           each_serializer: NoteIndexSerializer,
           total_durations:,
           meta: {
             **pagination(paginated_notes),
             notes_count: notes.count,
           },
           include: ["user", "user.profile", "tags"],
           adapter: :json,
           status: :ok
  end

  private

    def find_notes
      notes = public_notes
      queries = (params[:q] || '').split(/[[:blank:]]+/).select(&:present?)

      return notes if queries.blank?

      searched_notes = search_notes(notes, queries)
    end

    def paginate_notes(notes)
      notes.order(published_at: :desc).
            page(params[:page] || 1).
            per(10)
    end

    def public_notes
      Note.includes(
        user: { profile: { avatar_attachment: :blob } },
        tags: {},
      ).published
    end

    def search_notes(notes, queries)
      negative_queries, positive_queries =
        queries.partition {|query| query.start_with?("-") }

      result = positive_queries.reduce(notes) do |scope, query|
        next scope if query.blank?
        scope.search_by_query(query)
      end

      negative_queries.reduce(result) do |scope, query|
        next scope if query.blank?
        scope.delete_by_query(query.delete_prefix('-'))
      end
    end
end
