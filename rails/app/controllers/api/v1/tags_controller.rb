class Api::V1::TagsController < Api::V1::ApplicationController
  def index
    tags = Tag.all

    render json: tags, each_serializer: TagSerializer, status: :ok
  end
end
