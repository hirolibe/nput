class Api::V1::NotesController < Api::V1::ApplicationController
  include Pagination
  before_action :authenticate_user!, only: [:create, :update]

  def index
    notes = Note.published.order(created_at: :desc).page(params[:page] || 1).per(10)
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
    filtered_params = note.published_at.present? ? delete_published_at(note_params) : note_params
    note.update!(filtered_params)
    render json: note
  end

  private

    def note_params
      params.require(:note).permit(:title, :content, :status, :published_at)
    end

    def delete_published_at(params_with_published_at)
      params_with_published_at.tap {|p| p.delete(:published_at) }
    end
end
