class Api::V1::CommentsController < Api::V1::ApplicationController
  before_action :authenticate_user!, only: [:create, :destroy]

  def index
    note = Note.published.find(params[:note_id])
    comments = note.comments.includes(user: { profile: :avatar_attachment })
    render json: comments, include: ["user", "user.profile"], status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "ノートにアクセスできません" }, status: :not_found
  end

  def create
    note = Note.published.find(params[:note_id])
    comment = note.comments.build(comment_params)
    comment.user = current_user
    if comment.save
      render json: { message: "コメントを追加しました！" }, status: :created
    else
      render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "ノートにアクセスできません" }, status: :not_found
  end

  def destroy
    comment = current_user.comments.find(params[:id])
    comment.destroy!
    render json: { message: "コメントを削除しました" }, status: :ok
  rescue ActiveRecord::RecordNotDestroyed
    render json: { error: "コメントの削除に失敗しました" }, status: :unprocessable_entity
  rescue ActiveRecord::RecordNotFound
    render json: { error: "コメントにアクセスできません" }, status: :not_found
  end

  private

    def comment_params
      params.require(:comment).permit(:content)
    end
end
