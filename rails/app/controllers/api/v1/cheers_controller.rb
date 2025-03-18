class Api::V1::CheersController < Api::V1::ApplicationController
  before_action :fetch_authenticated_current_user, only: [:show]
  before_action :authenticate_user!, only: [:create, :destroy]
  before_action :restrict_guest_user!, only: [:create, :destroy]

  def show
    note = Note.find_by(slug: params[:note_slug])
    unless note
      return render json: { error: "ノートにアクセスできません" }, status: :not_found
    end

    cheer_status = current_user ? current_user.has_cheered?(note) : false

    render json: { has_cheered: cheer_status }, status: :ok
  end

  def create
    if current_user.cheer_points < 360
      return render json: { error: "保有エールポイントが不足しています" }, status: :unprocessable_entity
    end

    note = Note.published.find_by(slug: params[:note_slug])
    unless note
      return render json: { error: "ノートにアクセスできません" }, status: :not_found
    end

    ActiveRecord::Base.transaction do
      current_user.cheers.create!(note:)
      current_user.update!(cheer_points: current_user.cheer_points - 360)
    end

    render status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  rescue ActiveRecord::RecordNotSaved
    render json: { error: "保有エールポイントの更新に失敗しました" }, status: :unprocessable_entity
  end

  def destroy
    note = Note.published.find_by(slug: params[:note_slug])
    unless note
      return render json: { error: "ノートにアクセスできません" }, status: :not_found
    end

    cheer = current_user.cheers.find_by(note_id: note.id)

    if cheer
      cheer.destroy!
      render status: :ok
    else
      render json: { error: "このノートにエールしていません" }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotDestroyed
    render json: { error: "エールの削除に失敗しました" }, status: :unprocessable_entity
  end
end
