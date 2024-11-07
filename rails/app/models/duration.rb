class Duration < ApplicationRecord
  belongs_to :user
  belongs_to :note

  after_create :add_cheer_points

  private

    def add_cheer_points
      calculated_points = (duration / 300).floor

      if calculated_points.positive? && user.cheer_points < 50
        additional_points = [calculated_points, 50 - user.cheer_points].min
        user.cheer_points += additional_points
        user.save!
      end
    end
end
