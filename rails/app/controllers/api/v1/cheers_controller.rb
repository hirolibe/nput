class Api::V1::CheersController < Api::V1::ApplicationController
  before_action :authenticate_user!, only: [:show, :create, :destroy]

  def show
    note = Note.published.find(params[:note_id])
    cheer_status = current_user.has_cheered?(note)

    render json: { has_cheered: cheer_status }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "ノートにアクセスできません" }, status: :not_found
  end

  def create
    if current_user.cheer_points < 5
      return render json: { error: "保有エールポイントが不足しています" }, status: :unprocessable_entity
    end

    note = Note.published.find(params[:note_id])

    ActiveRecord::Base.transaction do
      current_user.cheers.create!(note:)
      current_user.update!(cheer_points: current_user.cheer_points - 5)
    end

    render status: :created
  rescue ActiveRecord::RecordNotFound
    render json: { error: "ノートにアクセスできません" }, status: :not_found
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  rescue ActiveRecord::RecordNotSaved
    render json: { error: "保有エールポイントの更新に失敗しました" }, status: :unprocessable_entity
  end

  def destroy
    note = Note.published.find(params[:note_id])
    cheer = current_user.cheers.find_by(note_id: note.id)

    if cheer
      cheer.destroy!
      render status: :ok
    else
      render json: { error: "このノートにエールしていません" }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotDestroyed
    render json: { error: "エールの削除に失敗しました" }, status: :unprocessable_entity
  rescue ActiveRecord::RecordNotFound
    render json: { error: "ノートにアクセスできません" }, status: :not_found
  end
end
