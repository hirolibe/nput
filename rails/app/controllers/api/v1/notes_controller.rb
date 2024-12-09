class Api::V1::NotesController < Api::V1::ApplicationController
  include Pagination
  before_action :authenticate_user!, only: [:create, :update, :destroy]

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
    ).published.find_by(id: params[:id])

    if note
      render json: note,
             include: ["comments", "comments.user", "comments.user.profile", "user", "user.profile", "tags"],
             status: :ok
    else
      render json: { error: "ノートにアクセスできません" }, status: :not_found
    end
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
      record_duration(note)
      add_cheer_points(note)
      update_tags(note)

      note_params = prepare_note_params(note)
      note.update!(note_params)
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

    def record_duration(note)
      Duration.create!(
        user: note.user,
        note:,
        duration: params[:duration],
      )
    end

    def add_cheer_points(note)
      seconds_per_point = 300
      calculated_points = (params[:duration].to_i / seconds_per_point).floor

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

    def prepare_note_params(note)
      note_params = params.require(:note).permit(:title, :description, :content, :status)

      if note_params[:status] == "published" && note.published_at.blank?
        note_params[:published_at] = Time.current
      end

      note_params
    end
end
