class ChangeDefaultCheerPointsInUsers < ActiveRecord::Migration[7.0]
  def change
    change_column_default :users, :cheer_points, from: 0, to: 3600
  end
end
