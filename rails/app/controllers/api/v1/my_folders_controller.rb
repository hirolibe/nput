class Api::V1::MyFoldersController < Api::V1::ApplicationController
  include Pagination
  before_action :authenticate_user!, only: [:index, :show, :create, :update, :destroy]
  before_action :restrict_guest_user!, only: [:create, :update, :destroy]

  def index
    folders = current_user.folders.
                order(name: :asc).
                page(params[:page] || 1).
                per(10)

    render json: folders,
           each_serializer: FolderSerializer,
           meta: pagination(folders),
           adapter: :json,
           status: :ok
  end

  def show
    folder = current_user.folders.find_by(slug: params[:folder_slug])

    if folder
      render json: folder, status: :ok
    else
      render json: { error: "フォルダにアクセスできません" }, status: :not_found
    end
  end

  def create
    folder = current_user.folders.build(folder_params)

    if folder.save
      render json: folder, status: :created
    else
      render json: { errors: folder.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    folder = current_user.folders.find_by(slug: params[:folder_slug])
    unless folder
      return render json: { error: "フォルダにアクセスできません" }, status: :not_found
    end

    folder.update!(folder_params)

    render json: { message: "フォルダ名を更新しました！" }, status: :ok
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def destroy
    folder = current_user.folders.find_by(slug: params[:folder_slug])
    unless folder
      return render json: { error: "フォルダにアクセスできません" }, status: :not_found
    end

    folder.destroy!

    render json: { message: "フォルダを削除しました" }, status: :ok
  rescue ActiveRecord::RecordNotDestroyed
    render json: { error: "フォルダの削除に失敗しました" }, status: :unprocessable_entity
  end

  private

    def folder_params
      params.require(:folder).permit(:name)
    end
end
