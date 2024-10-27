class Api::V1::SupportersController < Api::V1::ApplicationController
  def index
    note = Note.published.find(params[:note_id])
    users = note.supporters.
              includes(profile: { avatar_attachment: :blob }).
              order("cheers.created_at DESC")
    render json: users, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "ノートにアクセスできません" }, status: :not_found
  end
end
