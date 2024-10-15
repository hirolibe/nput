class Api::V1::CommentsController < Api::V1::ApplicationController
  def index
    note = Note.published.find(params[:note_id])
    comments = note.comments.includes(:user)
    render json: comments
  end
end
