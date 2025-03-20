class Api::V1::FoldersController < Api::V1::ApplicationController
  include Pagination

  def index
    user = User.find_by!(name: params[:name])
    folders = user.folders.
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
    user = User.find_by!(name: params[:name])
    folder = user.folders.find_by(slug: params[:slug])

    if folder
      render json: folder, status: :ok
    else
      render json: { error: "フォルダにアクセスできません" }, status: :not_found
    end
  end
end
