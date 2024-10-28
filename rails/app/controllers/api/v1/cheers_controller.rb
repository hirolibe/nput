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
    note = Note.published.find(params[:note_id])

    if current_user.has_cheered?(note)
      return render json: { error: "すでにこのノートにエールしています" }, status: :unprocessable_entity
    end

    if current_user.profile.cheer_points >= 1
      handle_cheer(note)
    else
      render json: { error: "保有エールポイントが不足しています" }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "ノートにアクセスできません" }, status: :not_found
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

  private

    def handle_cheer(note)
      ActiveRecord::Base.transaction do
        current_user.cheers.create!(note_id: note.id)
        current_user.profile.cheer_points -= 1

        raise ActiveRecord::Rollback unless current_user.profile.save

        render json: { cheer_status: true }, status: :created
      end
    rescue ActiveRecord::Rollback
      render json: { error: "保有エールポイントの更新に失敗しました" }, status: :unprocessable_entity
    rescue ActiveRecord::RecordInvalid
      render json: { error: "ノートへのエールに失敗しました" }, status: :unprocessable_entity
    end
end
