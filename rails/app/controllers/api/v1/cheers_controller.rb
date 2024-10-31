class Api::V1::CheersController < Api::V1::ApplicationController
  before_action :authenticate_user!, only: [:show, :create, :destroy]

  def show
    note = Note.published.find(params[:note_id])
    cheer_status = current_user.has_cheered?(note)
    render json: { cheer_status: }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "ノートにアクセスできません" }, status: :not_found
  end

  def create
    unless current_user.profile.cheer_points >= 1
      return render json: { error: "保有エールポイントが不足しています" }, status: :unprocessable_entity
    end

    note = Note.published.find(params[:note_id])

    ActiveRecord::Base.transaction do
      current_user.cheers.create!(note:)

      current_user.profile.cheer_points -= 1
      current_user.profile.save!

      render json: { cheer_status: true }, status: :created
    end
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
      render json: { cheer_status: false }, status: :ok
    else
      render json: { error: "まだこのノートにエールしていません" }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotDestroyed
    render json: { error: "エールの削除に失敗しました" }, status: :unprocessable_entity
  rescue ActiveRecord::RecordNotFound
    render json: { error: "ノートにアクセスできません" }, status: :not_found
  end
end
