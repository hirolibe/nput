class Api::V1::CommentsController < Api::V1::ApplicationController
  before_action :authenticate_user!, only: [:create, :destroy]

  def create
    note = Note.published.find_by(slug: params[:note_slug])
    unless note
      return render json: { error: "ノートにアクセスできません" }, status: :not_found
    end

    comment = note.comments.build(comment_params)
    comment.user = current_user
    attach_images(comment, params[:image_signed_ids])
    if comment.save
      render json: comment, include: ["user", "user.profile"], status: :created
    else
      render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
    end
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
