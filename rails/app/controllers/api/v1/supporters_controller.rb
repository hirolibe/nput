class Api::V1::SupportersController < Api::V1::ApplicationController
  include Pagination

  def index
    note = Note.published.find_by(slug: params[:note_slug])
    unless note
      return render json: { error: "ノートにアクセスできません" }, status: :not_found
    end

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
