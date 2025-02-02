class Api::V1::Auth::GuestRegistrationsController < Api::V1::ApplicationController
  def create
    if firebase_token.blank?
      return render json: { error: "トークンが見つかりません" }, status: :bad_request
    end

    begin
      decoded_token = verify_token
    rescue => e
      Rails.logger.error("Firebase認証エラー: #{e.message}")
      return render json: { error: e.message }, status: :unauthorized
    end

    if decoded_token.blank?
      return render json: { error: "認証情報が無効です" }, status: :unauthorized
    end

    begin
      ActiveRecord::Base.transaction do
        user = User.create!(uid: decoded_token["sub"], email: generate_random_email, name: generate_random_name)

        note_data = DummyData::Note::NOTE
        note = user.notes.create!(
          title: note_data[:title],
          content: note_data[:content],
          status: :unsaved,
        )

        create_durations(note)
        note.status = "draft"
        note.save!

        render json: { message: "ゲストとしてログインしました！" }, status: :created
      end
    rescue ActiveRecord::RecordInvalid
      render json: { error: "アカウントの作成に失敗しました" }, status: :unprocessable_entity
    rescue
      render json: { error: "予期せぬエラーが発生しました" }, status: :internal_server_error
    end
  end

  private

    def generate_random_email
      "guest_#{SecureRandom.hex(5)}@example.com"
    end

    def generate_random_name
      "Guest_#{SecureRandom.hex(5)}"
    end

    def create_durations(note)
      [
        DummyData::Duration.daily_durations,
        DummyData::Duration.weekly_durations,
        DummyData::Duration.monthly_durations,
      ].flatten.each do |duration_data|
        Duration.create!(
          user: note.user,
          note:,
          duration: duration_data[:duration],
          created_at: duration_data[:created_at],
        )
      end
    end
end
