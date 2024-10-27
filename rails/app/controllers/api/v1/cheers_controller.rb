class Api::V1::CheersController < Api::V1::ApplicationController
  before_action :authenticate_user!, only: [:show, :create]

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

  private

    def handle_cheer(note)
      current_user.cheers.create!(note_id: note.id)
      current_user.profile.cheer_points -= 1

      if current_user.profile.save
        cheer_status = current_user.has_cheered?(note)
        render json: { cheer_status: }, status: :created
      else
        render json: { error: "保有エールポイントの更新に失敗しました" }, status: :unprocessable_entity
      end
    rescue ActiveRecord::RecordInvalid
      render json: { error: "ノートへのエールに失敗しました" }, status: :unprocessable_entity
    end
end
