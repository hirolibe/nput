class Api::V1::CheersController < Api::V1::ApplicationController
  before_action :authenticate_user!, only: [:create, :destroy]

  def create
    if current_user.profile.cheer_points.zero?
      return render json: { error: "保有エールポイントが不足しています" }, status: :unprocessable_entity
    end

    note = Note.published.find(params[:note_id])

    ActiveRecord::Base.transaction do
      current_user.cheers.create!(note:)
      current_user.profile.update!(cheer_points: current_user.profile.cheer_points - 1)
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
      render json: { error: "まだこのノートにエールしていません" }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotDestroyed
    render json: { error: "エールの削除に失敗しました" }, status: :unprocessable_entity
  rescue ActiveRecord::RecordNotFound
    render json: { error: "ノートにアクセスできません" }, status: :not_found
  end
end
