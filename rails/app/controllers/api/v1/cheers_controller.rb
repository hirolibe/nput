class Api::V1::CheersController < Api::V1::ApplicationController
  before_action :authenticate_user!, only: [:show]

  def show
    note = Note.published.find(params[:note_id])
    cheer_status = current_user.has_cheered?(note)
    render json: { cheer_status: }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "ノートにアクセスできません" }, status: :not_found
  end
end
