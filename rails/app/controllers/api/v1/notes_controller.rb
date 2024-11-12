class Api::V1::NotesController < Api::V1::ApplicationController
  include Pagination
  before_action :fetch_authenticated_current_user, only: [:index, :show]
  before_action :authenticate_user!, only: [:create, :update, :destroy]

  def index
    notes = Note.includes(
      user: { profile: { avatar_attachment: :blob } },
      tags: {},
    ).published.
              order(created_at: :desc).
              page(params[:page] || 1).
              per(10)

    total_durations = Duration.where(note_id: notes.map(&:id)).group(:note_id).sum(:duration)

    render json: notes,
           each_serializer: NoteIndexSerializer,
           current_user:,
           total_durations:,
           include: ["user", "user.profile", "tags"],
           meta: pagination(notes),
           adapter: :json,
           status: :ok
  end

  def show
    note = Note.includes(
      comments: { user: { profile: { avatar_attachment: :blob } } },
      user: { profile: { avatar_attachment: :blob } },
      tags: {},
    ).published.find(params[:id])

    render json: note,
           current_user:,
           include: ["comments", "comments.user", "comments.user.profile", "user", "user.profile", "tags"],
           status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "ノートにアクセスできません" }, status: :not_found
  end

  def create
    unsaved_note = current_user.notes.unsaved.first || current_user.notes.create!(status: :unsaved)
    render json: unsaved_note, status: :ok
  rescue ActiveRecord::RecordInvalid
    render json: { error: "ノートの新規作成に失敗しました" }, status: :unprocessable_entity
  end

  def update
    note = current_user.notes.find(params[:id])

    ActiveRecord::Base.transaction do
      note = update_note(note)
      record_duration(note)
      add_cheer_points(note)
      update_tags(note)
    end

    render json: { note: NoteSerializer.new(note), message: "ノートを更新しました！" }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "ノートにアクセスできません" }, status: :not_found
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def destroy
    note = current_user.notes.find(params[:id])
    note.destroy!
    render json: { message: "ノートを削除しました" }, status: :ok
  rescue ActiveRecord::RecordNotDestroyed
    render json: { error: "ノートの削除に失敗しました" }, status: :unprocessable_entity
  rescue ActiveRecord::RecordNotFound
    render json: { error: "ノートにアクセスできません" }, status: :not_found
  end

  private

    def note_params
      params.require(:note).permit(:title, :content, :status, :published_at)
    end

    def filtered_note_params(note)
      note.published_at.present? ? note_params.except(:published_at) : note_params
    end

    def update_note(note)
      note.update!(filtered_note_params(note))
      note
    end

    def record_duration(note)
      Duration.create!(
        user: note.user,
        note:,
        duration: params[:duration],
      )
    end

    def add_cheer_points(note)
      last_duration_value = note.durations.last.duration
      seconds_per_point = 300
      calculated_points = (last_duration_value / seconds_per_point).floor

      max_points = 50
      user = note.user
      remaining_points = max_points - user.cheer_points

      if calculated_points.positive? && remaining_points.positive?
        additional_points = [calculated_points, remaining_points].min
        user.cheer_points += additional_points
        user.save!
      end
    end

    def update_tags(note)
      return note.tags.clear if params[:tag_names].blank?

      note.tags = params[:tag_names].map {|name| Tag.find_or_create_by!(name:) }
    end
end
