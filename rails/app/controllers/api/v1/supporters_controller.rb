class Api::V1::SupportersController < Api::V1::ApplicationController
  include Pagination

  def index
    note = Note.published.find(params[:note_id])
    users = note.supporters.
              includes(profile: { avatar_attachment: :blob }).
              order("cheers.created_at DESC").
              page(params[:page] || 1).
              per(10)
    render json: users,
           each_serializer: BasicUserSerializer,
           meta: pagination(users),
           adapter: :json,
           status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "ノートにアクセスできません" }, status: :not_found
  end
end
