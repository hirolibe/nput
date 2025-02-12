class Api::V1::Admin::GuestsController < Api::V1::ApplicationController
  before_action :authenticate_admin!, only: [:destroy_all]

  def destroy_all
    users = User.where(guest: true)
    delete_user(users)

    render json: { message: "すべてのゲストユーザーを削除しました" }, status: :ok
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

    def delete_user(users)
      ActiveRecord::Base.transaction do
        users.destroy_all
        users.map do |user|
          delete_firebase_account(user.uid)
        end
      end
    end
end
