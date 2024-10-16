class Api::V1::NotesController < Api::V1::ApplicationController
  include Pagination
  before_action :authenticate_user!, only: [:create, :update, :destroy]

  def index
    notes = Note.published.order(created_at: :desc).page(params[:page] || 1).per(10).includes(:user)
    render json: notes, each_serializer: NoteIndexSerializer, meta: pagination(notes), adapter: :json
  end

  def show
    note = Note.published.find(params[:id])
    render json: note
  end

  def create
    unsaved_note = current_user.notes.unsaved.first || current_user.notes.create!(status: :unsaved)
    render json: unsaved_note
  end

  def update
    note = current_user.notes.find(params[:id])

    filtered_params = if note.published_at.present?
                        delete_published_at(note_params)
                      else
                        note_params
                      end

    if note.update(filtered_params)
      render json: note, status: :ok
    else
      render json: { errors: note.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    note = current_user.notes.find(params[:id])
    note.destroy!
  end

  private

    def note_params
      params.require(:note).permit(:title, :content, :status, :published_at)
    end

    def delete_published_at(params_with_published_at)
      params_with_published_at.tap {|p| p.delete(:published_at) }
    end
end
