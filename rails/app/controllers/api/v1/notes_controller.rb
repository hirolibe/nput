class Api::V1::NotesController < Api::V1::ApplicationController
  include Pagination
  before_action :authenticate_user!, only: :create

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
end
