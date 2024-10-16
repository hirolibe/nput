class Api::V1::CommentsController < Api::V1::ApplicationController
  before_action :authenticate_user!, only: [:create]

  def index
    note = Note.published.find(params[:note_id])
    comments = note.comments.includes(:user)
    render json: comments
  end

  def create
    note = Note.published.find(params[:note_id])
    comment = note.comments.build(comment_params)
    comment.user = current_user
    if comment.save
      render json: comment, status: :created
    else
      render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

    def comment_params
      params.require(:comment).permit(:content)
    end
end
