class Api::V1::ImageUploadsController < Api::V1::ApplicationController
  before_action :authenticate_user!, only: [:upload, :attach_avatar]

  def upload
    if params[:image].present? && valid_image_type?(params[:image].content_type)
      blob = ActiveStorage::Blob.create_and_upload!(
        io: params[:image].tempfile,
        filename: params[:image].original_filename,
        content_type: params[:image].content_type,
      )
      render json: { signed_id: blob.signed_id }, status: :created
    else
      render json: { error: "画像のアップロードに失敗しました" }, status: :unprocessable_entity
    end
  end

  def attach_avatar
    if params[:image_signed_id].present?
      profile = current_user.profile
      profile.avatar.attach(params[:image_signed_id])

      if profile.avatar.attached?
        render json: { message: "画像を変更しました" }, status: :ok
      else
        render json: { error: "画像の変更に失敗しました" }, status: :unprocessable_entity
      end
    else
      render json: { error: "有効な画像が指定されていません" }, status: :unprocessable_entity
    end
  end

  private

    def valid_image_type?(content_type)
      %w[image/png image/jpg image/jpeg image/gif].include?(content_type)
    end
end
