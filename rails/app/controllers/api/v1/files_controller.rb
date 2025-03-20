class Api::V1::FilesController < Api::V1::ApplicationController
  before_action :authenticate_user!, only: [:show, :create, :destroy]
  before_action :restrict_guest_user!, only: [:show, :create, :destroy]

  def show
    folder = current_user.folders.find_by(slug: params[:folder_slug])
    unless folder
      return render json: { error: "フォルダにアクセスできません" }, status: :not_found
    end

    note = current_user.notes.find_by(slug: params[:note_slug])
    unless note
      return render json: { error: "ノートにアクセスできません" }, status: :not_found
    end

    is_filed = folder.has_filed?(note)

    render json: { is_filed: }, status: :ok
  end

  def create
    folder = current_user.folders.find_by(slug: params[:folder_slug])
    unless folder
      return render json: { error: "フォルダにアクセスできません" }, status: :not_found
    end

    note = current_user.notes.find_by(slug: params[:note_slug])
    unless note
      return render json: { error: "ノートにアクセスできません" }, status: :not_found
    end

    note_folder = NoteFolder.new(note_id: note.id, folder_id: folder.id)

    if note_folder.save
      render status: :created
    else
      render json: { errors: note_folder.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    folder = current_user.folders.find_by(slug: params[:folder_slug])
    unless folder
      return render json: { error: "フォルダにアクセスできません" }, status: :not_found
    end

    note = current_user.notes.find_by(slug: params[:note_slug])
    unless note
      return render json: { error: "ノートにアクセスできません" }, status: :not_found
    end

    note_folder = folder.note_folders.find_by(note_id: note.id)

    if note_folder
      note_folder.destroy!
      render status: :ok
    else
      render json: { error: "このノートはフォルダ内にありません" }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotDestroyed
    render json: { error: "ノートの取り出しに失敗しました" }, status: :unprocessable_entity
  end
end
