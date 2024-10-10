class Api::V1::NotesController < Api::V1::ApplicationController
  include Pagination

  def index
    notes = Note.published.order(created_at: :desc).page(params[:page] || 1).per(10)
    render json: notes, each_serializer: NoteIndexSerializer, meta: pagination(notes), adapter: :json
  end

  def show
    note = Note.published.find(params[:id])
    render json: note
  end
end
