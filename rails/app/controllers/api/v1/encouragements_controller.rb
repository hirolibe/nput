class Api::V1::EncouragementsController < Api::V1::ApplicationController
  include Pagination

  def index
    user = User.find(params[:user_id])
    notes = user.cheered_notes.
              includes(user: { profile: { avatar_attachment: :blob } }).
              order("cheers.created_at DESC").
              page(params[:page] || 1).
              per(10)
    render json: notes,
           each_serializer: NoteIndexSerializer,
           include: ["user", "user.profile"],
           meta: pagination(notes),
           adapter: :json,
           status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "アカウントにアクセスできません" }, status: :not_found
  end
end
